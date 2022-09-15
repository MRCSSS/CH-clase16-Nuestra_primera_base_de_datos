/* ---------------------------- MODULOS -----------------------------*/
const express = require('express');
const path = require('path');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const ProdContenedor = require('./src/prodsystem.js');
const MessagesContenedor = require('./src/msgsystem.js');
const morgan = require('morgan');

/* ---------------------- INSTANCIA DE SERVER -----------------------*/
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const router = require('./src/routes/all.routes.js');
 
/* -------------------------- MIDDLEWARES ---------------------------*/
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));

/* ------------------------------ RUTAS -----------------------------*/
app.use('/', router);

/* ------------------------- BASE DE DATOS --------------------------*/
const prods = new ProdContenedor('./public/productos.txt');
const msgs = new MessagesContenedor('./public/messages.txt');

/* ---------------------------- WEBSOCKET ---------------------------*/
io.on('connection', async (socket) => {
    console.log(`Client conected: ${socket.id}`);

    const DB_MSG = await msgs.getAll();
    const DB_PROD = await prods.getAll();
    
    socket.emit('from-server-msg', {DB_MSG} );
    socket.emit('from-server-prodUpdate', {DB_PROD} );

    socket.on('from-client-msg', async (msg) => {
        await msgs.save(msg);
        DB_MSG.push(msg);
        io.sockets.emit('from-server-msg', {DB_MSG});
    })
    socket.on('from-client-prodUpdate', async (prod) => {
        const newID = await prods.save(prod);
        const newProduct = {...prod, id:newID}

        DB_PROD.push(newProduct);
        io.sockets.emit('from-server-prodUpdate', {DB_PROD});
    })
})

/* ---------------------------- SERVIDOR ----------------------------*/
const PORT = 8081;
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
})

// server.on('error', err => {
//     console.log(`Server error: ${err}`);
// })

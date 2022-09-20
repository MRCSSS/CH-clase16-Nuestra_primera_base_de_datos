/* ---------------------------- MODULOS ----------------------------- */
import express from 'express';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { MessagesContenedor } from "./src/container/msgsystem.js";
import { ProdContenedor } from "./src/container/prodsystem.js";
import router from './src/routes/all.routes.js';

/* ---------------------- INSTANCIA DE SERVER ----------------------- */
const app = express();
const httpServer = createServer();
const io = new Server(httpServer);

/* -------------------------- MIDDLEWARES --------------------------- */
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));

/* ------------------------------ RUTAS ----------------------------- */
app.use('/', router);

app.get('*', async (request, response) => {
    response.status(404).send('404 - Page not found!!');
});

/* ------------------------- BASE DE DATOS --------------------------*/
const prods = new ProdContenedor('products');
const msgs = new MessagesContenedor('messages');

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

/* ---------------------------- SERVIDOR ---------------------------- */
const PORT = 8081;
const server = httpServer.listen(PORT, () => {
    console.log(`Server listening: http://localhost:${PORT}`);
})

server.on('error', err => {
    console.log(`Server error: ${err}`);
})

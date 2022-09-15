/* ---------------------------- MODULOS -----------------------------*/
const socket = io();

/* ---------------------------- WEBSOCKET ---------------------------*/
socket.on('from-server-prodUpdate', data => {
    renderProd(data.DB_PROD);
})

socket.on('from-server-msg', data => {
    renderChat(data.DB_MSG);
})

/* --------------------------- HANDLEBARS ---------------------------*/
    /* ------------------------- Layouts ------------------------ */
const home = `
    <div class="jumbotron">
        {{> form}}
        {{> prod_table}}
    </div>
    <div class="jumbotron">
        {{> chat}}
    </div>
`;

    /* ------------------------ Partials ----------------------- */
Handlebars.registerPartial( // Forms de ingreso de productos
    "form", 
    `<h1 style="color:blue;">Ingrese Producto</h1>
    <br>
    <form>
        <div class="form-group">
            <label for="title"><b>Nombre:</b></label>
            <input id="title" class="form-control" type="text" name="title">
        </div>
        <div class="form-group">
            <label for="price"><b>Precio:</b></label>
            <input id="price" class="form-control" type="number" name="price" step="0.01">
        </div>
        <div class="form-group">
            <label for="thumbnail"><b>Imagen:</b></label>
            <input id="thumbnail" class="form-control" type="text" name="thumbnail">
        </div>
        <button class="btn btn-success mt-3 mb-3" onclick="addProduct()">Enviar</button>
    </form>
    `
);
Handlebars.registerPartial( // Tabla para mostrar productos
    "prod_table", 
    `<h2 style="color:crimson;">Lista de Productos</h2>
    <div id="prodTableContent"></div>`
);
Handlebars.registerPartial( // Chat
    "chat", 
    `<h2 style="color:blue;">Centro de Mensajes</h2>
    <form >
        <div class="form-group">
            <label for="user"><b>Usuario:</b></label>
            <input id="user" class="form-control" type="text" name="user" placeholder="José">
            <small id="userComment" class="form-text text-muted">Usuario que enviará el mensaje.</small>
        </div>
        <div class="form-group">
            <label for="messageContent"><b>Mensaje:</b></label>
            <textarea id="messageContent" class="form-control" name="messageContent" rows="1"></textarea>
        </div>
        <button class="btn btn-primary mt-3 mb-3" onclick="sendMessage()">Enviar</button>
    </form>
    <hr>
    <div id="messagesRecord">
        <!-- Se renderizarán los mensajes ya enviados -->
        {{#each messages}}
            <span>
                <b style="color:blue;">{{this.author}}</b>
                <small style="color:crimson;"> [{{this.date}}] </small> <b style="color:blue;">:</b>
                <i style="color:green;"> {{this.message}} </i>
            </span>
            <br>
        {{/each}}
    </div>    
    `
);

const html = Handlebars.compile(home);
document.querySelector('#root').innerHTML = html();

/* ----------------------------- RENDERS ----------------------------*/
const renderChat = (messages) => {
    const allMessages = messages.map((msg) => {
        return `
        <span>
            <b style="color:blue;">${msg.author}</b>
            <small style="color:crimson;"> [${msg.date}] </small> <b style="color:blue;">:</b>
            <i style="color:green;"> ${msg.message} </i>
        </span>
        ` 
    }).join('<br>');

    document.querySelector('#messagesRecord').innerHTML = allMessages;
}

const renderProd = (products) => {
    let allProducts = '';
    if ( products.length > 0 ) {
        const tableContent = products.map((prod) => {
            return `
                <tr> 
                    <td>${prod.title}</td>
                    <td style="text-align: center;">$ ${prod.price}</td>
                    <td style="text-align: center;">
                        <img width="30" src="${prod.thumbnail}" alt="">
                    </td>
                </tr>
            `
        }).join("\n");
        allProducts = `
            <div class="table-responsive">
                <table class="table table-dark">
                    <tr> 
                        <th>Nombre</th> 
                        <th style="text-align: center;">Precio</th> 
                        <th style="text-align: center;">Imagen</th> 
                    </tr>
                    <!-- filas -->
                    ${tableContent}
                    <!-- Fin filas -->
                </table>
            </div>
        `;
    } else {
        allProducts = '<h3 class="alert alert-warning">No se encontraron productos</h3>';
    }

    document.querySelector('#prodTableContent').innerHTML = allProducts;
}

/* ---------------------------- FUNCIONES ---------------------------*/
function sendMessage() {
    const nowDate = new Date();
    
    const inputUser = document.querySelector('#user');
    const inputMessage = document.querySelector('#messageContent');
    const inputDate = 
    `${nowDate.getDate() > 9 ? nowDate.getDate() : `0${nowDate.getDate()}`}/`+
    `${nowDate.getMonth() > 9 ? nowDate.getMonth() : `0${nowDate.getMonth()}`}/${nowDate.getFullYear()} `+
    `${nowDate.getHours() > 9 ? nowDate.getHours() : `0${nowDate.getHours()}`}:`+
    `${nowDate.getMinutes() > 9 ? nowDate.getMinutes() : `0${nowDate.getMinutes()}`}:`+
    `${nowDate.getSeconds() > 9 ? nowDate.getSeconds() : `0${nowDate.getSeconds()}`}`;

    const msg = {
        author: inputUser.value,
        date: inputDate,
        message: inputMessage.value
    }

    socket.emit('from-client-msg', msg)
}

function addProduct() {
    const inputTitle = document.querySelector('#title');
    const inputPrice = document.querySelector('#price');
    const inputThumbnail = document.querySelector('#thumbnail');

    const prod = {
        title: inputTitle.value,
        price: inputPrice.value,
        thumbnail: inputThumbnail.value
    }

    socket.emit('from-client-prodUpdate', prod)
}
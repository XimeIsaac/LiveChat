"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes")); // Asegúrate de que este router sea el correcto
const socket_io_1 = require("socket.io");
(0, dotenv_1.config)(); // Carga las variables de entorno
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware para redirigir la raíz a /home
app.get('/', (req, res) => {
    res.redirect('/home');
});
// Sirve archivos estáticos (JS, CSS, etc.) desde la carpeta 'public'
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
// Usa las rutas definidas en 'routes'
app.use(routes_1.default);
const server = app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
const io = new socket_io_1.Server(server);
// Manejo de sockets para la comunicación en tiempo real
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
    socket.on('joinRoom', ({ roomId, user }) => {
        const room = 'room-' + roomId;
        socket.join(room);
        socket.to(room).emit('userJoined', { user });
    });
    socket.on('sendNewMessage', (data) => {
        const room = 'room-' + data.room;
        io.to(room).emit('messageReceived', data);
    });
    socket.on('leaveRoom', ({ roomId, user }) => {
        const room = 'room-' + roomId;
        socket.leave(room);
        socket.to(room).emit('userLeft', { user });
    });
    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
    });
});

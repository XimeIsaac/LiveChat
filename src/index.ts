import express from 'express';
import { config } from 'dotenv';
import path from 'path';
import router from './routes';
import { Server } from 'socket.io';

config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para redirigir la raíz a /home
app.get('/', (req, res) => {
    res.redirect('/home');
});

app.use('', express.static(path.join(__dirname, 'public')));
app.use(router);

const server = app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});

const io = new Server(server);

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

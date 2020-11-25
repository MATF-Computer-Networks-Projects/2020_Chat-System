import { envVal } from './envVal';
import { Socket } from 'socket.io';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', (socket: Socket) => {
  console.log('User connected: ', socket.id);
  socket.on('message', (evt) => {
    console.log('event received: ', evt);
    socket.broadcast.emit('message', evt);
  })
});

io.on('disconnect', () => {
  console.log('User disconnected');
});

server.listen(envVal.serverPort, () =>
  console.log(`listening on ${envVal.serverPort}`)
);


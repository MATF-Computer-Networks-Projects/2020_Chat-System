import { envVal } from './envVal';
import { Socket } from 'socket.io';
import express from 'express';
import { socketEvents } from './types';

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});

io.on(socketEvents.CONNECTION, (socket: Socket) => {
  console.log('User connected: ', socket.id);
  
  socket.on(socketEvents.SEND_USERNAME, (msg) => {
    console.log('event received: ', msg);
  });

});

io.on(socketEvents.DISCONNECT, () => {
  console.log('User disconnected');
});

server.listen(envVal.serverPort, () => {
  console.log(`listening on ${envVal.serverPort}`)
});


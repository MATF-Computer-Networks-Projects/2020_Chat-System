import { envVal } from './envVal';
import { Socket } from 'socket.io';
import express from 'express';
import { 
  socketEvents, 
  ActiveUser,
  SendUsernameMessage,
  SendActiveUsersMessage,
} from './types';

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});

let activeUsers: ActiveUser[] = [];

io.on(socketEvents.CONNECTION, (socket: Socket) => {
  console.log('User connected: ', socket.id);
  
  socket.on(socketEvents.SEND_USERNAME, (msg: SendUsernameMessage) => {

    if(!msg.username) {
      return;
    }

    activeUsers.push({
      username: msg.username,
      socketId: socket.id
    });

    console.log('Currently active users: ', activeUsers);
    
  
  });

  socket.on(socketEvents.SEND_ACTIVE_USERS, (msg: SendActiveUsersMessage) => {
    
    if(!msg.socketId) {
      return
    }
    
    console.log('sendActiveUsers from: ', msg.socketId);
    socket.to('/#' + msg.socketId).emit(socketEvents.RECEIVE_ACTIVE_USERS, {
      activeUsers
    })
  })

});

io.on(socketEvents.DISCONNECT, () => {
  console.log('User disconnected');
});

server.listen(envVal.serverPort, () => {
  console.log(`listening on ${envVal.serverPort}`)
});


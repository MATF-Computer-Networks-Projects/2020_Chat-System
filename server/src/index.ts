import { envVal } from './envVal';
import { Socket } from 'socket.io';
import express from 'express';
import { 
  socketEvents, 
  SendActiveUsersMessage,
  ClientUserData,
  SendMessageData,
} from './types';

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});

let activeUsers: ClientUserData[] = [];

io.on(socketEvents.CONNECTION, (socket: Socket) => {
  console.log('User connected: ', socket.id);
  
  socket.on(socketEvents.SEND_USERNAME, (msg: ClientUserData) => {

    if(!msg.username) {
      return;
    }

    if(
      activeUsers
      .map(e => e.userId)
      .find(e => e === msg.userId)
    ) {
      return;
    }


    activeUsers.push({
      username: msg.username,
      userId: msg.userId,
    });

    console.log('Currently active users: ', activeUsers);
    
    //? Notify all other users that a new connection was established so they can update ActiveUserList accordingly
    socket.broadcast.emit(socketEvents.RECEIVE_ACTIVE_USERS, {
      activeUsers
    })
  });

  socket.on(socketEvents.SEND_ACTIVE_USERS, () => {
        
    socket.emit(socketEvents.RECEIVE_ACTIVE_USERS, {
      activeUsers
    })
  })

  socket.on(socketEvents.SEND_MESSAGE, (msg: SendMessageData) => {
    
    console.log('SEND_MESSAGE: ', msg)
    const sender = msg.senderId

    console.log('RECEIVER: ', socketEvents.RECEIVE_MESSAGE + msg.recipientId);

    socket.broadcast.emit(socketEvents.RECEIVE_MESSAGE + msg.recipientId, {
      sender,
      message: msg.message
    })

  })

});

io.on(socketEvents.DISCONNECT, () => {
  console.log('User disconnected');
});

server.listen(envVal.serverPort, () => {
  console.log(`listening on ${envVal.serverPort}`)
});


import { envVal } from './envVal';
import { Socket } from 'socket.io';
import express from 'express';
import { 
  socketEvents, 
  SendActiveUsersMessage,
  ActiveUser,
  SingleMessage,
  Chat,
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
  
  socket.on(socketEvents.SEND_USERNAME, (msg: ActiveUser) => {

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

  socket.on(socketEvents.SEND_MESSAGE, (msg: SingleMessage) => {
    
    console.log('SEND_MESSAGE: ', msg)

    console.log('RECEIVERS: ',msg.receivers);

    msg.receivers.forEach(receiver => {
      const newMessage: SingleMessage = {
        sender: msg.sender,
        receivers: msg.receivers,
        message: msg.message,
        timestampUTC: msg.timestampUTC,
        seen: msg.seen,
        type: msg.type,
        name: msg.name,
      }
      console.log('RECEIVE_MESSAGE: ', socketEvents.RECEIVE_MESSAGE + receiver.userId)
      socket.broadcast.emit(socketEvents.RECEIVE_MESSAGE + receiver.userId, newMessage)
    })
  })

  socket.on(socketEvents.CHECK_USERNAME, (username: string) => {
    console.log('CHECK_USERNAME: ', username);

    if(
      activeUsers
      .find(usr => usr.username === username)
    ) {
      socket.emit(socketEvents.RECEIVE_CHECK_USERNAME, true);
    } else {
      return socket.emit(socketEvents.RECEIVE_CHECK_USERNAME, false);
    }

  })

  socket.on(socketEvents.SEND_GROUP_CHAT, (groupChat: Chat) => {
    console.log('SEND_GROUP_CHAT: ', groupChat)
    groupChat.users.forEach(user => {
      socket.broadcast.emit(socketEvents.RECEIVE_GROUP_CHAT + user.userId, groupChat);
    })
  })

});

io.on(socketEvents.DISCONNECT, () => {
  console.log('User disconnected');
});

server.listen(envVal.serverPort, () => {
  console.log(`listening on ${envVal.serverPort}`)
});


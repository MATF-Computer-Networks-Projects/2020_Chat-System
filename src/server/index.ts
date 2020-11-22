import { envVal } from '../envVal';
import { Socket } from 'socket.io';

const server = require('http').createServer();
const io = require('socket.io')(server);

io.on('connection', (socket: Socket) => {
  console.log('User connected');
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


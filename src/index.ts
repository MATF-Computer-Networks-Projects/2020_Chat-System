import express from 'express';
import { Request, Response } from 'express';
import * as socketio from 'socket.io'
import path from 'path';

const app = express();
const defaultPort = 4000;
app.set('port', defaultPort);


let http = require('http').Server(app);
let io = require('socket.io')(http);


app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.resolve('./src/client/index.html'));
});

io.on('connection', (socket: socketio.Socket) => {
  console.log('User connected');

  socket.on('disconnect', () => {
    console.log('User disconnected')
  });

});

http.listen(defaultPort, () =>
  console.log(`listening on ${defaultPort}`)
);


import { envVal } from '../envVal';
import * as repl from 'repl';
import chalk from 'chalk';
import { ClientData } from './types';

const socket = require('socket.io-client')(envVal.serverUrl);

socket.on('connect', () => {
  console.log(chalk.magenta('=== Connected ==='));
})

socket.on('disconnect', () => {
  socket.emit('disconnect');
})

socket.on('message', (data: ClientData) => {
  const { cmd, username } = data;
  console.log(chalk.green(username + ': ' + cmd))
})

repl.start({
  prompt: '',
  eval: (cmd) => {
    socket.send({cmd, username: 'test'})
  }
})
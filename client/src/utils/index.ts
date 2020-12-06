import io, { Socket } from 'socket.io-client';
import { socketEvents } from '../types';


export const asyncConnect = async():Promise<typeof Socket> => {
  return new Promise( (resolve, _reject) => {
    setTimeout(() => {
      const socket = io.connect(process.env.REACT_APP_SERVER_URL as string);
      socket.on(socketEvents.CONNECT, () => {
          resolve(socket)
      });
    }, 500)
  });
}
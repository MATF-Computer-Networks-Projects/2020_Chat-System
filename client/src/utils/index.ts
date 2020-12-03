import { rejects } from 'assert';
import io, { Socket } from 'socket.io-client';


export const asyncConnect = async():Promise<typeof Socket> => {
    console.log('asyncConnect');
    return new Promise( (resolve, _reject) => {
        setTimeout(() => {
            const socket = io.connect(process.env.REACT_APP_SERVER_URL as string);
            socket.on('connect', () => {
                resolve(socket)
            });
        }, 500)
    });
}
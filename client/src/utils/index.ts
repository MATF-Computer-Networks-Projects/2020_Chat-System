import { rejects } from 'assert';
import io, { Socket } from 'socket.io-client';


export const asyncConnect = async():Promise<typeof Socket> => {
    return new Promise( (resolve, reject) => {
        const socket = io.connect(process.env.REACT_APP_SERVER_URL as string);
        socket.on('connect', () => {
            resolve(socket)
        });
        setTimeout(rejects, 1000);
    });
}
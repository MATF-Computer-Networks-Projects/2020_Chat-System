export const socketEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECTION: 'connection',
  SEND_USERNAME: 'sendUsername',
}

export interface ActiveUser {
  socketId: string,
  username: string,
}

export interface SendUsernameMessage {
  username: string
}
export const socketEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECTION: 'connection',
  SEND_USERNAME: 'sendUsername',
  SEND_ACTIVE_USERS: 'sendActiveUsers',
  RECEIVE_ACTIVE_USERS: 'receiveActiveUsers',
}

export interface ActiveUser {
  socketId: string,
  username: string,
}

export interface SendUsernameMessage {
  username: string
}

export interface SendActiveUsersMessage {
  socketId: string
}
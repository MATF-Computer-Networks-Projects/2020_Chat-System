export const socketEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECTION: 'connection',
  SEND_USERNAME: 'sendUsername',
  SEND_ACTIVE_USERS: 'sendActiveUsers',
  RECEIVE_ACTIVE_USERS: 'receiveActiveUsers',
}

export interface ActiveUser {
  username: string,
  userId: string
}

export interface SendUsernameMessage {
  username: string
  userId: string
}

export interface SendActiveUsersMessage {
  socketId: string
}
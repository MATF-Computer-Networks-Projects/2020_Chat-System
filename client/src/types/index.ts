export const socketEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECTION: 'connection',
  SEND_USERNAME: 'sendUsername',
  SEND_ACTIVE_USERS: 'sendActiveUsers',
  RECEIVE_ACTIVE_USERS: 'receiveActiveUsers',
}


export interface ActiveUser {
  userId: string,
  username: string,
}

export interface ReceiveActiveUsersMessage {
  activeUsers: ActiveUser[]
}
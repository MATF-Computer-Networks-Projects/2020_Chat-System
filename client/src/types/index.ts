export const socketEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECTION: 'connection',
  SEND_USERNAME: 'sendUsername',
  SEND_ACTIVE_USERS: 'sendActiveUsers',
  RECEIVE_ACTIVE_USERS: 'receiveActiveUsers',
  SEND_MESSAGE: 'sendMessage',
  RECEIVE_MESSAGE: 'receiveMessage'
}


export interface ActiveUser {
  userId: string,
  username: string,
}

export interface SingleMessage {
  senderId: string, 
  recipientId: string,
  message: string,
  timestampUTC: number
}


export interface ReceiveActiveUsersMessage {
  activeUsers: ActiveUser[]
}
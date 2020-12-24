export const socketEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECTION: 'connection',
  SEND_USERNAME: 'sendUsername',
  
  SEND_ACTIVE_USERS: 'sendActiveUsers',
  RECEIVE_ACTIVE_USERS: 'receiveActiveUsers',
  
  SEND_MESSAGE: 'sendMessage',
  RECEIVE_MESSAGE: 'receiveMessage',

  CHECK_USERNAME: 'checkUsername',
  RECEIVE_CHECK_USERNAME: 'receiveCheckUsername',

  SEND_GROUP_CHAT: 'sendGroupChat',
  RECEIVE_GROUP_CHAT: 'receiveGroupChat',
}

export const errorMessages = {
  USERNAME_ALREADY_EXISTS: 'Username already exists, please choose another one.',
  USERNAME_EMPTY: 'Username must not be empty.',
  BACKEND_UNREACHABLE: 'Backend unreachable.'
}

export interface ActiveUser {
  userId: string,
  username: string,
}

export interface SingleMessage {
  senderId: string, 
  recipientId: string,
  message: string,
  timestampUTC: number,
  seen: boolean,
}


export interface ReceiveActiveUsersMessage {
  activeUsers: ActiveUser[]
}
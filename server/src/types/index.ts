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

export interface ActiveUser {
  username: string
  userId: string
}

export interface SingleMessage {
  sender: ActiveUser, 
  receivers: ActiveUser[],
  message: string,
  timestampUTC: number,
  seen: boolean,
  type: 'text' | 'file' | 'image'
}

export interface Chat {
  users: ActiveUser[],
  messages: SingleMessage[],
  type: 'single' | 'group'
}

export interface SendActiveUsersMessage {
  socketId: string
}
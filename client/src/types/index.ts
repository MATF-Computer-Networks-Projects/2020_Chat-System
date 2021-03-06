export const socketEvents = {
  CONNECT: 'connect',
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
  
  DISCONNECT_USER: 'disconnectUser',
  RECEIVE_DISCONNECTED_USER: 'receiveDisconnectedUser'
}

export const errorMessages = {
  USERNAME_ALREADY_EXISTS: 'Username already exists, please choose another one.',
  USERNAME_EMPTY: 'Username must not be empty.',
  BACKEND_UNREACHABLE: 'Backend unreachable.'
}

export interface Chat {
  users: ActiveUser[],
  messages: SingleMessage[],
  type: 'single' | 'group'
}

export interface ActiveUser {
  userId: string,
  username: string,
}

export interface SingleMessage {
  sender: ActiveUser, 
  receivers: ActiveUser[],
  message: string,
  timestampUTC: number,
  seen: boolean,
  type: 'text' | 'file' | 'image',
  name: string,
}

export interface UserState {
  currentUser: ActiveUser,
  currentUserChats: Chat[]
}

export type UserAction = {
  type: string
  username?: string
  userId?: string
  newChat?: Chat
  updatedChat?: Chat
  allChats?: Chat[]
}
  
export type DispatchType = (args: UserAction) => UserAction
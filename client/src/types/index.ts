export const socketEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECTION: 'connection',
  SEND_USERNAME: 'sendUsername',
  SEND_ACTIVE_USERS: 'sendActiveUsers',
}


interface ActiveUser {
  socketId: string,
  username: string,
}

export interface SendActiveUsersMessage {
  activeUsers: ActiveUser[]
}
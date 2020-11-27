interface IUser {
    id: string,
    socketId: string,
    username: string,
  }
type UserState = {
  users: IUser[]
}

type UserAction = {
  type: string
  user: IUser
}
  
type DispatchType = (args: UserAction) => UserAction
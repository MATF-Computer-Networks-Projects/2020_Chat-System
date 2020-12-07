interface IUser {
    id: string,
    username: string,
    socket: object
  }
type UserState = {
  user: IUser | undefined,
}

type UserAction = {
  type: string
  user: IUser
}
  
type DispatchType = (args: UserAction) => UserAction



type UserState = {
  username: string
  userId: string
}

type UserAction = {
  type: string
  username?: string
  userId?: string
}
  
type DispatchType = (args: UserAction) => UserAction
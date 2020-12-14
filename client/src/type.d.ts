
type UserState = {
  username: string
}

type UserAction = {
  type: string
  username: string
}
  
type DispatchType = (args: UserAction) => UserAction
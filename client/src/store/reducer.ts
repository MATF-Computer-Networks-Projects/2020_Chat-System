import * as actionTypes from './actionTypes';
import { v4 as uuidv4 } from 'uuid';

const initialState: UserState = {
  users:[]
}

const reducer = ( state: UserState = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case actionTypes.ADD_USER:
      const newUser: IUser = {
        id: uuidv4(),
        socketId: action.user.socketId,
        username: action.user.username,
      }
      return {
        ...state,
        users: state.users.concat(newUser)
      }
    case actionTypes.REMOVE_USER:
      const updatedUsers: IUser[] = state.users.filter(
        user => user.id !== action.user.id
      )
      return {
        ...state,
        users: updatedUsers
      }
    case actionTypes.GET_USERS:
      return state
  }
  return state
}

export default reducer
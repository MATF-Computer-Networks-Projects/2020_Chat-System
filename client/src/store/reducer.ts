import * as actionTypes from './actionTypes';
import { v4 as uuidv4 } from 'uuid';

const initialState: UserState = {
  user: undefined,
}

const reducer = ( state: UserState = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case actionTypes.ADD_USER:
      const newUser: IUser = {
        id: uuidv4(),
        username: action.user.username,
        socket: action.user.socket
      }
      return {
        ...state,
        user: newUser
      }
    case actionTypes.REMOVE_USER:
      return {
        ...state,
        user: undefined
      }
    case actionTypes.GET_USERS:
      return state
  } 
  return state
}

export default reducer
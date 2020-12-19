import * as actionTypes from './actionTypes';

const initialState: UserState = {
  username: '',
  userId: ''
}

const reducer = ( state: UserState = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case actionTypes.ADD_USERNAME:
      return {
        ...state,
        username: action.username as string
      }
    case actionTypes.ADD_USER_ID:
      return {
        ...state,
        userId: action.userId as string
      }

  }
  return state
}

export default reducer
import * as actionTypes from './actionTypes';

const initialState: UserState = {
  username: ""
}

const reducer = ( state: UserState = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case actionTypes.ADD_USERNAME:
      return {
        ...state,
        username: action.username
      }
  }
  return state
}

export default reducer
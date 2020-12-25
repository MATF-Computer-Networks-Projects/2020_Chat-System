import * as actionTypes from './actionTypes';
import {
  UserState,
  UserAction,
  Chat,

} from '../types';
import * as chat from '../utils/chat';

const initialState: UserState = {
  currentUser: {
    username: '',
    userId: '',
  },
  currentUserChats: []
}

const reducer = ( state: UserState = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case actionTypes.ADD_USERNAME:
      return {
        ...state,
        currentUser:{
          userId: state.currentUser.userId,
          username: action.username as string
        }
      }
    case actionTypes.ADD_USER_ID:
      return {
        ...state,
        currentUser: {
          userId: action.userId as string,
          username: state.currentUser.username as string,
        }
      }
    case actionTypes.ADD_NEW_CHAT:
      if (chat.chatAlreadyExists(state.currentUserChats, action.newChat as Chat)) {
        return state;
      }
      return {
        ...state,
        currentUserChats: [...state.currentUserChats, action.newChat as Chat]
      }

  }
  return state
}

export default reducer
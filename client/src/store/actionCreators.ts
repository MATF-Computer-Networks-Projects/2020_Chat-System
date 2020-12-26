import * as actionTypes from './actionTypes';
import {
  UserAction,
  DispatchType,
  Chat,
} from '../types'

export const addUsername = (username: string) => {
  const action: UserAction = {
    type: actionTypes.ADD_USERNAME,
    username,
  }
  return dispatchAction(action)
}

export const addUserId = (userId: string) => {
  const action: UserAction = {
    type: actionTypes.ADD_USER_ID,
    userId,
  }
  return dispatchAction(action)
}

export const addNewChat = (newChat: Chat) => {
  const action: UserAction = {
    type: actionTypes.ADD_NEW_CHAT,
    newChat,
  }
  return dispatchAction(action)
}

export const updateSingleChat = (updatedChat: Chat) => {
  const action: UserAction = {
    type: actionTypes.UPDATE_SINGLE_CHAT,
    updatedChat
  }
  return dispatchAction(action)
}


export const dispatchAction = (action: UserAction) => {
  return (dispatch: DispatchType) => {
    dispatch(action);
  }
}
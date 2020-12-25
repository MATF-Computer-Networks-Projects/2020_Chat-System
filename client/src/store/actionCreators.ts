import * as actionTypes from './actionTypes';
import {
  UserAction,
  DispatchType,
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


export const dispatchAction = (action: UserAction) => {
  return (dispatch: DispatchType) => {
    dispatch(action);
  }
}
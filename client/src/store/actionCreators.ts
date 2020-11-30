import * as actionTypes from './actionTypes';

export const addUser = (user: IUser) => {
  const action: UserAction = {
    type: actionTypes.ADD_USER,
    user,
  }
  return dispatchAction(action)
}

export const removeUser = (user: IUser) => {
  const action: UserAction = {
    type: actionTypes.REMOVE_USER,
    user,
  }
  return dispatchAction(action);
}

export const getUsers = (user: IUser) => {
  const action: UserAction = {
    type: actionTypes.ADD_USER,
    user,
  }
  return dispatchAction(action)
}


export const dispatchAction = (action: UserAction) => {
  return (dispatch: DispatchType) => {
    dispatch(action);
  }
}
import * as actionTypes from './actionTypes';

export const addUsername = (username: string) => {
  const action: UserAction = {
    type: actionTypes.ADD_USERNAME,
    username,
  }
  return dispatchAction(action)
}

export const dispatchAction = (action: UserAction) => {
  return (dispatch: DispatchType) => {
    dispatch(action);
  }
}
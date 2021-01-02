import {
  ActiveUser,
  UserState,
  socketEvents,
} from '../types';
import React from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { addUsername } from '../store/actionCreators';

export default function DisconnectComponent() {
  const socket = useSocket()
  const history = useHistory()
  const dispatch = useDispatch()

  const currentUser = useSelector(
    (state: UserState) => state.currentUser,
    shallowEqual
  );

  const addUsernameCallback = React.useCallback(
    (username: string) => dispatch(addUsername(username)),
    [dispatch]
  )


  const handleDisconnect = () => {
    socket.emit(socketEvents.DISCONNECT_USER, currentUser)
    addUsernameCallback('')
    history.push('/')
  }

  return (
    <Button
      fullWidth
      color='secondary'
      onClick={handleDisconnect}
    >
      <b>Disconnect</b>
    </Button>
  )
}
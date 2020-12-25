import React, { FormEvent, useEffect } from 'react';
import { 
  socketEvents, 
  errorMessages,
  UserState
} from '../types';
import { Socket } from 'socket.io-client';
import { useHistory } from 'react-router-dom';
import { useSocket } from '../contexts/SocketProvider';
import { addUsername } from '../store/actionCreators';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';


export default function RegisterUser() {  
  
  const [username, setUsername] = React.useState<string>('');
  const [errorMsg, setErrorMsg] = React.useState<string>('');

  const history = useHistory();
  const socket = useSocket() as typeof Socket;

  const currentUser = useSelector(
    (state: UserState) => state.currentUser,
    shallowEqual
  );

  const dispatch = useDispatch();

  useEffect(() => {

    if(currentUser.username !== '') {
      history.push('/home');
      return;
    }
  });

  const addUsernameCallback = React.useCallback(
    (username: string) => dispatch(addUsername(username)),
    [dispatch]
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    if (username === '') {
      setErrorMsg(errorMessages.USERNAME_EMPTY)
      return;
    }

    if(!socket) {
      setErrorMsg(errorMessages.BACKEND_UNREACHABLE);
    }

    socket.emit(socketEvents.CHECK_USERNAME, username);
    socket.on(socketEvents.RECEIVE_CHECK_USERNAME, (usernameExists: boolean) => {
      if(usernameExists) {
        setErrorMsg(errorMessages.USERNAME_ALREADY_EXISTS);
        return;
      }
      addUsernameCallback(username);
      console.log('currentUser', currentUser)
      
      const userId = currentUser.userId;

      socket.emit(socketEvents.SEND_USERNAME, {userId, username});

      
      history.push('/home');
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUsername(e.currentTarget.value);
  }
  
  const generateInputForm = () => {
    return (
      <Container>
        <form onSubmit={handleSubmit}>
          <h2>Enter username</h2>
          <Grid container spacing={3}>
            <Grid item  xs={3} />
            <Grid item  xs={6} >
              <TextField 
                type='text'
                id='username'
                onChange={handleInputChange} 
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item  xs={3} />
            <Grid item  xs={6} >
              <Button 
                type="submit"
                fullWidth
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
        <div><h3>{errorMsg}</h3></div>
      </Container>
    )
  }  
  return generateInputForm();
}
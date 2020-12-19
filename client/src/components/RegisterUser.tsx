import React, { FormEvent } from 'react';
import { 
  socketEvents, 
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
  
  const [username, setUsername] = React.useState<string>("");
  const [badUsername, setBadUsername] = React.useState<boolean>(true);
  const [errorMsg, setErrorMsg] = React.useState<string>("");

  const history = useHistory();
  const socket = useSocket() as typeof Socket;

  const userId = useSelector(
    (state: UserState) => state.userId,
    shallowEqual
  );

  const dispatch = useDispatch();

  const addUsernameCallback = React.useCallback(
    (username: string) => dispatch(addUsername(username)),
    [dispatch]
  )

  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    console.log('socket from server: ', socket);

    if (username === "") {
      setBadUsername(true)
      return;
    } else {
      setBadUsername(false);
    }

    if(!socket) {
      setErrorMsg('Backend unreachable');
    }

    socket.emit(socketEvents.SEND_USERNAME, {
      userId,
      username,
    });

    addUsernameCallback(username);
    history.push('/home');
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUsername(e.currentTarget.value);
  }
  
  const generateErrorMessageIfNeeded = () => {
    
    let error = errorMsg;
    
    if (badUsername) {
      error += "Username must not be empty\n";
    }
    return (
      <h3>{error}</h3>
    )

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
        <div>{generateErrorMessageIfNeeded()}</div>
      </Container>
    )
  }  
  return generateInputForm();
}
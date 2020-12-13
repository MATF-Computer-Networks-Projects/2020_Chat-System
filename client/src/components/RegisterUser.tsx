import React, { FormEvent } from 'react';
import { 
  socketEvents, 
} from '../types';
import { Socket } from 'socket.io-client';
import Home from './Home';
import { useHistory } from 'react-router-dom';

interface Props {
  socket: typeof Socket
}

export default function RegisterUser(props: Props) {  
  
  const [username, setUsername] = React.useState<string>("");
  const [badUsername, setBadUsername] = React.useState<boolean>(true);
  const [errorMsg, setErrorMsg] = React.useState<string>("");

  const history = useHistory();
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    const socket = props.socket;
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

    const usableSocket = socket as typeof Socket;

    usableSocket.emit(socketEvents.SEND_USERNAME, {
      username
    });

    history.push('/home');
  }

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
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
      <div>
        <form onSubmit={handleSubmit}>
          <h2>Enter username</h2>

          <input 
            type='text'
            id='username'
            onChange={handleInputChange} 
          />
          <button type="submit">Submit</button>
        </form>
        <div>{generateErrorMessageIfNeeded()}</div>
      </div>
    )
  }  
  return generateInputForm();
}
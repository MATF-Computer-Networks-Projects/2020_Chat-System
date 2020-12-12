import React, { FormEvent, useEffect } from 'react';
import { 
  socketEvents, 
  SendActiveUsersMessage
} from '../types';
import { Socket } from 'socket.io-client';
import Home from './Home';
import { asyncConnect } from '../utils';

export default function RegisterUser() {  
  
  const [socket, setSocket] = React.useState<typeof Socket>();
  const [username, setUsername] = React.useState<string>("");
  const [badUsername, setBadUsername] = React.useState<boolean>(true);
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const [signupSuccessful, setSignupSuccesful] = React.useState<boolean>(false);
  

  useEffect(() => {
    async function getSocket() {
      if(socket) {
        return;
      }
      const socketFromServer = await asyncConnect();
      setSocket(socketFromServer);
    }
    getSocket()
  }, []
  );


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

    const usableSocket = socket as typeof Socket;

    usableSocket.emit(socketEvents.SEND_USERNAME, {
      username
    });

    usableSocket.on(socketEvents.SEND_ACTIVE_USERS, (msg: SendActiveUsersMessage) => {
      console.log('activeUsers: ', msg.activeUsers);
    });
    
    setSignupSuccesful(true);

  }

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value);
  }
  
  const generateErrorMessageIfNeeded = () => {
    
    let error = errorMsg;
    
    if (badUsername) {
      error += "User name must not be empty\n";
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

  const render = () => {
    if(signupSuccessful) {
      return <Home socket={socket as typeof Socket}/>
    } else {
      return generateInputForm();
    }
  }
  return render();
}
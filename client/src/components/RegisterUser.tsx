import React, { FormEvent } from 'react';
import { asyncConnect } from '../utils/index';
import { 
  socketEvents, 
  SendActiveUsersMessage
} from '../types';
import { Socket } from 'socket.io-client';
import Home from './Home';


export default function RegisterUser() {  

  // let socket: typeof Socket;
  
  const [username, setUsername] = React.useState<string>("");
  const [badUsername, setBadUsername] = React.useState<boolean>(true);
  const [socket, setSocket] = React.useState<typeof Socket>();
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const [signupSuccessful, setSignupSuccesful] = React.useState<boolean>(false);
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    if (username === "") {
      setBadUsername(true)
      return;
    } else {
      setBadUsername(false);
    }

    const socketFromServer = await asyncConnect();
    if(!socketFromServer) {
      setErrorMsg('Backend unreachable');
    }

    setSocket(
      socketFromServer
    );
    console.log('socketFromServer: ', socketFromServer);
    console.log('socket: ', socket);

    
    if(!socket) {
      throw new Error('Socket is undefined');
    }
    
    console.log('socket: ', socket);

    socket.emit(socketEvents.SEND_USERNAME, {
      username
    });

    socket.on(socketEvents.SEND_ACTIVE_USERS, (msg: SendActiveUsersMessage) => {
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
      error += "User name must not be emtpy\n";
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
      return <Home socket={socket as typeof Socket} testString='stagod' />
    } else {
      return generateInputForm();
    }
  }
  return render();
}
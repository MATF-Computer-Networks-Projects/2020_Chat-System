import React, { FormEvent } from 'react';
import { asyncConnect } from '../utils/index';
import { 
  socketEvents, 
  SendActiveUsersMessage
} from '../types';
import { Socket } from 'socket.io-client';
import Home from './Home';



type CurrentUser = {
  username: string
  socket: typeof Socket | undefined
}

export default function RegisterUser() {  
  
  const [username, setUsername] = React.useState<string>("");
  const [socket, setSocket] = React.useState<typeof Socket>();
  const [badUsername, setBadUsername] = React.useState<boolean>(true);
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
    console.log('socketFromServer: ', socketFromServer);
    setSocket({
      ...socket,
      socketFromServer as typeof Socket
    });
    
    console.log('socket: ', socket);
    if(!socket) {
      throw new Error('socket is undefined');
    }


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
    if (badUsername) {
      return <h3>Username must not be empty</h3>
    }
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
      return <Home/>
    } else {
      return generateInputForm();
    }
  }
  return render();
}
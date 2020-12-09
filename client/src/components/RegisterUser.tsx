import React, { FormEvent } from 'react';
import { asyncConnect } from '../utils/index';
import { 
  socketEvents, 
  SendActiveUsersMessage
} from '../types';
import { Socket } from 'socket.io-client';


type CurrentUser = {
  username: string
  socket: typeof Socket | undefined
}

export default function RegisterUser() {  
  
  const [username, setUsername] = React.useState<string>("");
  const [socket, setSocket] = React.useState<typeof Socket | undefined>(undefined);
  const [badUsername, setBadUsername] = React.useState<boolean>(true);
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

    if (username === "") {
      setBadUsername(true)
      return;
    } else {
      setBadUsername(false);
    }

    event.preventDefault();
    setSocket(await asyncConnect());
    
    console.log('socket: ', socket);
    if(!socket) {
      throw new Error('socket is undefined');
    }

    setSocket(socket);

    socket.emit(socketEvents.SEND_USERNAME, {
      username
    });

    socket.on(socketEvents.SEND_ACTIVE_USERS, (msg: SendActiveUsersMessage) => {
      console.log('activeUsers: ', msg.activeUsers);
    });

      
    console.log('username: ', username);
    console.log('socket: ', socket);
    
  }

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    console.log('handleInputChange.value: ', e.currentTarget.value);

    setUsername(e.currentTarget.value);
  }
  
  const generateErrorMessageIfNeeded = () => {
    if (badUsername) {
      return <h3>Username must not be empty</h3>
    }
  }

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
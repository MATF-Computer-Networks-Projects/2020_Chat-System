import React, { FormEvent } from 'react';
import { useHistory} from 'react-router-dom';
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
  
  const [user, setUser] = React.useState<CurrentUser>({
    username: "",
    socket: undefined
  });
  const [badUsername, setBadUsername] = React.useState<boolean>(true);
  const history = useHistory();
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

    if (user.username === "") {
      setBadUsername(true)
      return;
    } else {
      setBadUsername(false);
    }

    event.preventDefault();
    const socket = await asyncConnect();
    
    setUser({
      ...user,
      socket
    })

    socket.emit(socketEvents.SEND_USERNAME, {
      username: user?.username
    })

    socket.on(socketEvents.SEND_ACTIVE_USERS, (msg: SendActiveUsersMessage) => {
      console.log('activeUsers: ', msg.activeUsers);
    })

        
    if(!user) {
      throw new Error('user is undefined');
    }    
  }

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      username: e.currentTarget.value,
    })
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
import { Socket } from "socket.io-client"
import { 
  socketEvents, 
  ActiveUser,
  ReceiveActiveUsersMessage,
} from '../types';
import React, { useEffect } from 'react';

interface Props {
  socket: typeof Socket
}

export default function Home (props: Props) {  
  const [activeUsers, setActiveUsers] = React.useState<ActiveUser[]>();

  useEffect(() => {
      props.socket.on(socketEvents.RECEIVE_ACTIVE_USERS, (msg: ReceiveActiveUsersMessage) => {
        console.log('received message: ', msg);
        setActiveUsers(msg.activeUsers);
      })
  });

  const displayActiveUsers = () => {

    props.socket.emit(socketEvents.SEND_ACTIVE_USERS, {socketId: props.socket.id});

    console.log('activeUsers: ', activeUsers);

    if(!activeUsers) {
      return;
    }
    
    return (
    <ul>
      {activeUsers.map(e => <li>{e.username}</li>)}
    </ul>
    )
  }

  return (    
    <div>
      <h2>Home </h2>
      <div>
        {displayActiveUsers()}
      </div>
    </div>
  )
}
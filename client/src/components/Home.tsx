import { 
  socketEvents, 
  ActiveUser,
  ReceiveActiveUsersMessage,
} from '../types';
import React, { useEffect } from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { v4 as uuidv4} from 'uuid';


interface Props {
  userId: string
}

export default function Home ({ userId }: Props) {  
  
  const [activeUsers, setActiveUsers] = React.useState<ActiveUser[]>();
  const [requestedActiveUsers, setRequestedActiveUsers] = React.useState<boolean>(false);
  const socket = useSocket();

  useEffect(() => {
      socket.on(socketEvents.RECEIVE_ACTIVE_USERS, (msg: ReceiveActiveUsersMessage) => {
        console.log('received message: ', msg);
        setActiveUsers(msg.activeUsers);
      })
  });

  const displayActiveUsers = () => {

    if(!requestedActiveUsers) {
      socket.emit(socketEvents.SEND_ACTIVE_USERS);
      setRequestedActiveUsers(true)
    }

    console.log('activeUsers: ', activeUsers);

    if(!activeUsers) {
      return;
    }
    
    return (
    <ul>
      {
        activeUsers
          .filter(e => e.userId !== userId)
          .map(e => <li id={uuidv4()}>{e.username}</li>)
      }
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
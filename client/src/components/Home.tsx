import { Socket } from "socket.io-client"
import { 
  socketEvents, 
  SendActiveUsersMessage
} from '../types';
interface Props {
  socket: typeof Socket
}

export default function Home (props: Props) {  
  

  props.socket.on(socketEvents.SEND_ACTIVE_USERS, (msg: SendActiveUsersMessage) => {
    console.log('activeUsersHome: ', msg.activeUsers);
  });

  console.log('props from Home component: ', props);
  return (    
    <h2>Home </h2>
  )
}
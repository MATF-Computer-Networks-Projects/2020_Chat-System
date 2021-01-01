import {
  ActiveUser,
  socketEvents
} from '../types';
import { useSocket } from '../contexts/SocketProvider';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

interface Props {
  updateCurrentUserChats: Function
}

export default function DisconnectComponent(props: Props) {
  const socket = useSocket()
  const history = useHistory()

  const handleDisconnect = () => {
    
  }

  return (
    <Button
      fullWidth
      color='secondary'
      onClick={handleDisconnect}
    >
      <b>Disconnect</b>
    </Button>
  )
}
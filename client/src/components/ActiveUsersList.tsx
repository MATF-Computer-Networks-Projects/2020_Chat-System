import React, { useEffect, useState } from 'react';
import { 
  ActiveUser,
  ReceiveActiveUsersMessage,
  socketEvents,
} from '../types';
import { useSocket } from '../contexts/SocketProvider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

interface Props {
  userId: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  }),
);
export default function ActiveUsersList(props: Props) {
  const socket = useSocket();
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>();
  const [requestedActiveUsers, setRequestedActiveUsers] = React.useState<boolean>(false);
  const classes = useStyles();
  
  useEffect(() => {

    if(!socket) {
      return;
    }

    socket.on(socketEvents.RECEIVE_ACTIVE_USERS, (msg: ReceiveActiveUsersMessage) => {
      console.log('received message: ', msg);
      setActiveUsers(msg.activeUsers);
    })
  });
  
  const generateActiveUsers = () => {
    if(!socket) {
      return (
      <div>Loading</div>
      )
    }

    if(!requestedActiveUsers) {
      socket.emit(socketEvents.SEND_ACTIVE_USERS);
      setRequestedActiveUsers(true)
    }

    console.log('activeUsers: ', activeUsers);

    if(!activeUsers) {
      return;
    }
    
    return (
      <List component='div' className={classes.root}>
        {
          activeUsers
            .filter(e => e.userId !== props.userId)
            .map(e => (
              <ListItem>
                <ListItemText primary={e.username}/>
              </ListItem>
              )
            )
        }
    </List>
    )
  }

  return (
    <div>
      {generateActiveUsers()}
    </div>
  )
}
import React, { useEffect, useState } from 'react';
import { 
  ActiveUser,
  ReceiveActiveUsersMessage,
  socketEvents,
  SingleMessage
} from '../types';
import { useSocket } from '../contexts/SocketProvider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { v4 as uuidv4 } from 'uuid';
import { shallowEqual, useSelector } from 'react-redux';


interface Props {
  updateSelectedUser: Function
  selectedUser: ActiveUser | undefined
  overwriteCurrentUserMessages: Function
  currentUserMessages: SingleMessage[]
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
  
  const userId = useSelector(
    (state: UserState) => state.userId,
    shallowEqual
  );

  useEffect(() => {

    if(!socket) {
      return;
    }

    socket.on(socketEvents.RECEIVE_ACTIVE_USERS, (msg: ReceiveActiveUsersMessage) => {
      console.log('RECEIVE_ACTIVE_USERS: ', msg);
      setActiveUsers(msg.activeUsers);
    })
  }, [socket]);
  
  const hasUnseenMessagesFromThisUser = (selectedUser: ActiveUser) => {

    if (props.selectedUser && selectedUser.userId === props.selectedUser.userId) {
      return false;
    }

    if(props.currentUserMessages.find(msg => msg.senderId === selectedUser.userId && msg.seen === false)) {
      return true;
    }
    return false;
  }

  const handleOnClick = (selectedUser: ActiveUser) => {
    console.log('currentUserMessages: ', props.currentUserMessages);

    const updatedCurrentUserMessages = props.currentUserMessages.map(
      msg => {
        if (msg.senderId === selectedUser.userId && msg.seen === false) {
          return {
            ...msg,
            seen: true
          }
        } 
        return msg  
      }
    )

    console.log('updatedCurrentUserMessages: ', updatedCurrentUserMessages);

    props.updateSelectedUser(selectedUser);
    props.overwriteCurrentUserMessages(updatedCurrentUserMessages);
  }

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
              .filter(user => user.userId !== userId)
              .map(user => (
                <ListItem id={uuidv4()}>
                  <Paper style={{width: '100%'}}>
                    <Box 
                      p={2} 
                      m={1} 
                      fontSize='h6.fontSize' 
                      fontWeight={hasUnseenMessagesFromThisUser(user) ? "fontWeightBold" : "fontWeightRegular"}
                      onClick={() => handleOnClick(user)}
                    >
                      {user.username}
                    </Box>
                  </Paper>
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
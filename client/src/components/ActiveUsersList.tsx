import React, { useEffect } from 'react';
import { 
  ActiveUser,
  ReceiveActiveUsersMessage,
  socketEvents,
  SingleMessage,
  Chat,
  UserState,
} from '../types';
import { useSocket } from '../contexts/SocketProvider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { v4 as uuidv4 } from 'uuid';
import { shallowEqual, useSelector } from 'react-redux';
import * as chat from '../utils/chat';
interface Props {
  updateSelectedUser: Function
  selectedUser: ActiveUser | undefined
  
  activeUsers: ActiveUser[] | undefined
  updateActiveUsers: Function
  
  updateCurrentUserChats: Function
  updateSingleUserChat: Function
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
  const [requestedActiveUsers, setRequestedActiveUsers] = React.useState<boolean>(false);
  const classes = useStyles();
  
  const currentUser = useSelector(
    (state: UserState) => state.currentUser,
    shallowEqual
  );

  const currentUserChats = useSelector(
    (state: UserState) => state.currentUserChats,
    shallowEqual
  );

  const createNewEmptyChatsIfNeeded = (activeUsers: ActiveUser[]) => {    
    activeUsers
      .filter(user => user.userId !== currentUser.userId)
      .forEach(user => {
        const newChat: Chat = {
          users: [currentUser, user],
          messages: [],
          type: 'single'
        }
        props.updateCurrentUserChats(newChat)
      }
    )
  }

  useEffect(() => {

    if(!socket) {
      return;
    }

    socket.on(socketEvents.RECEIVE_ACTIVE_USERS, (msg: ReceiveActiveUsersMessage) => {
      props.updateActiveUsers(msg.activeUsers);
      createNewEmptyChatsIfNeeded(msg.activeUsers);
    })
  }, [socket]);
  
  const hasUnseenMessagesFromCurrentChat = (user: ActiveUser) => {

    console.log('hasUnseenMessagesFromCurrentChat: ', user);

    const targetChat = chat.findChatByUsers(currentUserChats, [user, currentUser])
    if (!targetChat) {
      return false 
    }
    console.log('dosao 3');


    if (targetChat.messages.find(msg => msg.sender.userId === user.userId && msg.seen === false)) {
      return true;
    }
    console.log('kurcina');
    return false;
  }

  const handleOnClick = (newSelectedUser: ActiveUser) => {
    const targetChat = chat.findChatByUsers(currentUserChats, [currentUser, newSelectedUser])
    if (!targetChat) {
      return
    }

    const updatedChatMessages = targetChat.messages.map(msg => {
      return {...msg, seen: true}
    });

    const updatedChat = {
      ...targetChat,
      messages: updatedChatMessages
    }

    props.updateSingleUserChat(updatedChat);
    props.updateSelectedUser(newSelectedUser);
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


    if(!props.activeUsers) {
      return;
    }
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h2>Active users: </h2>
        </Grid>
        <Grid item xs={12}>
          <List component='div' className={classes.root}>
            {
              props.activeUsers
                .filter(user => user.userId !== currentUser.userId)
                .map(user => (
                  <ListItem key={uuidv4()}>
                    <Paper style={{width: '100%'}}>
                      <Box 
                        p={2} 
                        m={1} 
                        fontSize='h6.fontSize' 
                        fontWeight={hasUnseenMessagesFromCurrentChat(user) ? "fontWeightBold" : "fontWeightRegular"}
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
        </Grid>
      </Grid>
    )
  }

  return (
    <div>
      {generateActiveUsers()}
    </div>
  )
}
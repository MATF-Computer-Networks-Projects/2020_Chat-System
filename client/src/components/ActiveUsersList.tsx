import React, { useEffect } from 'react';
import { 
  ActiveUser,
  ReceiveActiveUsersMessage,
  socketEvents,
  SingleMessage,
  Chat
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


interface Props {
  updateSelectedUser: Function
  selectedUser: ActiveUser | undefined
  
  overwriteCurrentUserMessages: Function
  currentUserMessages: SingleMessage[]
  
  activeUsers: ActiveUser[] | undefined
  updateActiveUsers: Function
  
  currentUserChats: Chat[],
  updateCurrentUserChats: Function
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
  
  const userId = useSelector(
    (state: UserState) => state.userId,
    shallowEqual
  );

  const username = useSelector(
    (state: UserState) => state.username,
    shallowEqual
  );

  const createNewEmptyChatsIfNeeded = (activeUsers: ActiveUser[]) => {
    activeUsers.forEach(user => {
      if(!props.currentUserChats.find(chat => {
        return (chat.type === 'single' && chat.users.includes(user))
      })) {
        const currentlyActiveUser: ActiveUser = {userId, username}
        if(currentlyActiveUser === user) {
          return;
        }
        const newChat: Chat = {
          chatId: uuidv4(),
          users: [currentlyActiveUser, user],
          messages: [],
          type: 'single'
        }
        props.updateCurrentUserChats(newChat)
      }
    })
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

    console.log('currentUserChats: ', props.currentUserChats)

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
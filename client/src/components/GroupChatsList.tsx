import { 
  Button, 
  Grid,
  List,
  Paper, 
  Box, 
  ListItem,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormGroup
} from '@material-ui/core';
import { 
  ActiveUser,
  socketEvents,
  UserState,
  Chat,
} from '../types';
import { shallowEqual, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketProvider';
import * as chat from '../utils/chat';

interface Props {
  updateSelectedChat: Function
  selectedChat: Chat | undefined
  
  activeUsers: ActiveUser[] | undefined
  updateActiveUsers: Function
  
  updateCurrentUserChats: Function
  updateSingleUserChat: Function
}

export default function GroupChatsList(props: Props) {
  const socket = useSocket();
  
  const currentUser = useSelector(
    (state: UserState) => state.currentUser,
    shallowEqual
  );

  const currentUserChats = useSelector(
    (state: UserState) => state.currentUserChats,
    shallowEqual
  );

  
  const [usersForNewChat, setUsersForNewChat] = useState<ActiveUser[]>([currentUser]);
  const [createNewGroupClicked, setCreateNewGroupClicked] = useState(false);

  useEffect(() => {

    if(!socket) {
      return;
    }
    
    socket.on(socketEvents.RECEIVE_GROUP_CHAT + currentUser.userId , (newGroupChat: Chat) => {
      props.updateCurrentUserChats(newGroupChat);
    })
  }, [socket]);
  
  
  const handleCheckboxClick = (selectedUser: ActiveUser) => {
    if (!usersForNewChat.map(u => u.userId).includes(selectedUser.userId)) {
      setUsersForNewChat([...usersForNewChat, selectedUser])
    } else {
      setUsersForNewChat(usersForNewChat.filter(user => user.userId !== selectedUser.userId));
    }
  }

  const handleConfirm = () => {
    if (usersForNewChat.length === 1 ) {
      return;
    }

    const newGroupChat: Chat = {
      users: usersForNewChat,
      messages: [],
      type: "group"
    }

    socket.emit(socketEvents.SEND_GROUP_CHAT, newGroupChat)
    props.updateCurrentUserChats(newGroupChat)
    
    setUsersForNewChat([currentUser]);
    setCreateNewGroupClicked(false)
  }

  const handleOnClick = (newSelectedChat: Chat) => {
    const targetChat = chat.findChatByUsers(currentUserChats, newSelectedChat.users)
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
    props.updateSelectedChat(newSelectedChat);
  }

  const hasUnseenMessagesFromCurrentChat = (currentChat: Chat) => {
    const targetChat = chat.findChatByUsers(currentUserChats, currentChat.users)
    if (!targetChat) {
      return false 
    }

    if (targetChat.messages.find(msg => msg.sender.userId !== currentUser.userId && msg.seen === false)) {
      return true;
    }

    return false;
  }

  const generateActiveGroupChats = () => {
    return (
      <List component='div'>
        {
          currentUserChats
            .filter(chat => chat.type === "group")
            .map(chat => (
              <ListItem key={uuidv4()}>
                <Paper style={{width: '100%'}}>
                  <Box 
                    p={2} 
                    m={1} 
                    fontSize='h6.fontSize' 
                    fontWeight={hasUnseenMessagesFromCurrentChat(chat) ? "fontWeightBold" : "fontWeightRegular"}
                    onClick={() => handleOnClick(chat)}
                  >
                    {
                      chat.users
                      .map(user => {
                        if(user.userId === currentUser.userId) {
                          return 'You'
                        }
                        return user.username
                      })
                      .reduce((acc, username) => acc + ', ' + username)
                    }
                  </Box>
                </Paper>
              </ListItem>
              )
            )
        }
      </List>
    )
  }

  const generateActiveUsersCheckboxList = () => {
    if(!props.activeUsers || !createNewGroupClicked) {
      return
    }
    return (
      <FormControl component="fieldset">
        <FormGroup>
          {
            props.activeUsers
            .filter(user => user.userId !== currentUser.userId)
            .map(user => (
              <ListItem key={uuidv4()}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      onClick={() => handleCheckboxClick(user)} 
                      name={user.username} 
                      id={user.userId}
                      defaultChecked={usersForNewChat.map(user => user.userId).includes(user.userId)}
                    />}
                  label={user.username}
                />
              </ListItem>
              )
            )
          }
        </FormGroup>
      </FormControl>
    )
  }

  const generateConfirmButton = () => {
    if(!createNewGroupClicked) {
      return
    }
    return (
      <Button
        fullWidth
        onClick={() => handleConfirm()}
      >
        Confirm
      </Button>
    )
  }
  
  const generateCreateNewGroupButton = () => {
    if(createNewGroupClicked) {
      return
    }
    return (
      <Button
        fullWidth
        hidden={true}
        onClick={() => {setCreateNewGroupClicked(true)}}
      >
        + Create new group
      </Button>
    )
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
          <h2>Group chats: </h2>
      </Grid>
      <Grid item xs={12}>
        {generateActiveGroupChats()}
      </Grid>
      <Grid item xs={12}>
        {generateCreateNewGroupButton()}
      </Grid>
      <Grid item xs={12}>
        {generateActiveUsersCheckboxList()}
      </Grid>
      <Grid item xs={12}>
        {generateConfirmButton()}
      </Grid>
    </Grid>
  )
}
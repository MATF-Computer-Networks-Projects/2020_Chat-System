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

interface Props {
  activeUsers: ActiveUser[] | undefined
  updateCurrentUserChats: Function
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
      console.log('RECEIVE_GROUP_CHAT')
      props.updateCurrentUserChats(newGroupChat);
    })
  }, [socket]);
  
  
  const handleCheckboxClick = (selectedUser: ActiveUser) => {
    let updatedUsers = usersForNewChat
    if (!usersForNewChat.map(u => u.userId).includes(selectedUser.userId)) {
      updatedUsers.push(selectedUser)
      setUsersForNewChat(updatedUsers)
    } else {
      setUsersForNewChat(updatedUsers.filter(user => user.userId !== selectedUser.userId));
    }

  }

  const handleConfirm = () => {
    if (usersForNewChat.length === 1 ) {
      return;
    }

    console.log('usersForNewChat: ', usersForNewChat);
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

  const generateActiveGroupChats = () => {
    return (
      <List component='div'>
        {
          currentUserChats
            .filter(chat => chat.type === "group")
            .map(groupChat => (
              <ListItem key={uuidv4()}>
                <Paper style={{width: '100%'}}>
                  <Box 
                    p={2} 
                    m={1} 
                    fontSize='h6.fontSize' 
                    fontWeight="fontWeightRegular"
                    // fontWeight={hasUnseenMessagesFromThisUser(user) ? "fontWeightBold" : "fontWeightRegular"}
                    // onClick={() => handleOnClick(user)}
                  >
                    {
                      groupChat.users
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
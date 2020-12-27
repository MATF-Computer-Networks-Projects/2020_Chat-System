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

  const emptyGroupChat: Chat = {
    users: [currentUser],
    messages: [],
    type: "group"
  }

  const [groupChat, setGroupChat] = useState<Chat>(emptyGroupChat);
  const [createNewGroupClicked, setCreateNewGroupClicked] = useState(false);

  useEffect(() => {

    if(!socket) {
      return;
    }
    
    socket.on(socketEvents.RECEIVE_GROUP_CHAT + currentUser.userId , (groupChat: Chat) => {
      console.log('RECEIVE_GROUP_CHAT')
      props.updateCurrentUserChats(groupChat);
    })
  }, [socket]);
  
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleCheckBoxChange is checked', e.target.checked);
    const selectedUser: ActiveUser = {
      userId: e.target.id,
      username: e.target.name
    }


    if(e.target.checked) {
      setGroupChat({
        ...groupChat, 
        users: [...groupChat.users, selectedUser]})
    } else {
      const filteredOutUsers = groupChat.users.filter(user => user.userId !== selectedUser.userId)
      setGroupChat({
        ...groupChat,
        users: filteredOutUsers
      });
    }

    console.log('groupChat: ', groupChat)
  }

  const handleConfirm = () => {
    if (groupChat.users.length === 1 ) {
      return;
    }

    socket.emit(socketEvents.SEND_GROUP_CHAT, groupChat)
    props.updateCurrentUserChats(groupChat)
    
    setGroupChat(emptyGroupChat);
    setCreateNewGroupClicked(false)
  }

  const generateActiveGroupChats = () => {
    return (
      <List component='div'>
        {
          currentUserChats
            .filter(chat => chat.type == "group")
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
                      onChange={handleCheckboxChange} 
                      name={user.username} 
                      id={user.userId}
                      defaultChecked={false}
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
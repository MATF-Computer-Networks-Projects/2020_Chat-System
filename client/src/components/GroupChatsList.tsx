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
} from '../types';
import { shallowEqual, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketProvider';

interface Props {
  activeUsers: ActiveUser[] | undefined
  activeGroupChats: Array<ActiveUser[]>
  updateActiveGroupChats: Function
}

export default function GroupChatsList(props: Props) {
  const socket = useSocket();
  
  const currentUser = useSelector(
    (state: UserState) => state.currentUser,
    shallowEqual
  );


  const [groupChat, setGroupChat] = useState<ActiveUser[]>([currentUser]);
  const [createNewGroupClicked, setCreateNewGroupClicked] = useState(false);

  useEffect(() => {

    if(!socket) {
      return;
    }
    
    socket.on(socketEvents.RECEIVE_GROUP_CHAT, (groupChat: ActiveUser[]) => {
      props.updateActiveGroupChats(groupChat);
    })
  }, [socket]);
  
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedUser: ActiveUser = {
      userId: e.target.id,
      username: e.target.name
    }
    if(e.target.checked) {
      setGroupChat([...groupChat, selectedUser])
    } else {
      const filteredOutGroupChat = groupChat.filter(user => user.userId !== selectedUser.userId)
      setGroupChat(filteredOutGroupChat);
    }
  }

  const handleConfirm = () => {
    if (groupChat.length === 1 && groupChat[0] === currentUser) {
      return;
    }

    socket.emit(socketEvents.SEND_GROUP_CHAT, groupChat)
    props.updateActiveGroupChats(groupChat)
    setGroupChat([currentUser]);
    setCreateNewGroupClicked(false)
  }

  const generateActiveGroupChats = () => {
    return (
      <List component='div'>
        {
          props.activeGroupChats
            .map(groupChat => (
              <ListItem id={uuidv4()}>
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
                      groupChat
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
              <ListItem id={uuidv4()}>
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
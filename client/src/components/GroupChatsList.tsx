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
import { ActiveUser } from '../types';
import { shallowEqual, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

interface Props {
  activeUsers: ActiveUser[] | undefined
  activeGroupChats: Array<ActiveUser[]>
  updateActiveGroupChats: Function
}

export default function GroupChatsList(props: Props) {
  
  const userId = useSelector(
    (state: UserState) => state.userId,
    shallowEqual
  );

  const username = useSelector(
    (state: UserState) => state.username,
    shallowEqual
  );

  const [groupChat, setGroupChat] = useState<ActiveUser[]>([]);
  

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
    if (groupChat.length === 0) {
      return;
    }

    props.updateActiveGroupChats([...groupChat, {userId, username} ])
    setGroupChat([])
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
                    {groupChat.reduce((acc, user) => acc + ' ' + user.username, '')}
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
    console.log('groupChat: ', groupChat);
    if(!props.activeUsers) {
      return
    }
    return (
      <FormControl component="fieldset">
        <FormGroup>
          {
            props.activeUsers
            .filter(user => user.userId !== userId)
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
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
          <h2>Group chats: </h2>
      </Grid>
      <Grid item xs={12}>
        {generateActiveGroupChats()}
      </Grid>
      <Grid item xs={12}>
        <Button
          fullWidth
        >
          + Create new group
        </Button>
      </Grid>
      <Grid item xs={12}>
        {generateActiveUsersCheckboxList()}
      </Grid>
      <Grid item xs={12}>
        <Button
          fullWidth
          onClick={() => handleConfirm()}
        >
          Confirm
        </Button>
      </Grid>
    </Grid>
  )
}
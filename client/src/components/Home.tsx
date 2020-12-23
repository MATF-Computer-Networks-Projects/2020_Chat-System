import React, { useState, useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ActiveUsersList from './ActiveUsersList';
import GroupChatsList from './GroupChatsList';
import ChatTextbox from './ChatTextbox';
import Grid from '@material-ui/core/Grid';
import { 
  ActiveUser,
  SingleMessage,
} from '../types';


export default function Home () {  
  const history = useHistory();

  const username = useSelector(
    (state: UserState) => state.username,
    shallowEqual
  );

  const [selectedUser, setSelectedUser] = useState<ActiveUser>();
  const [currentUserMessages, setCurrentUserMessages] = useState<SingleMessage[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>();
  const [activeGroupChats, setActiveGroupChats] = useState<Array<ActiveUser[]>>([]);


  const updateSelectedUser = (newSelectedUser: ActiveUser) => {
    setSelectedUser(newSelectedUser);
  }

  const updateCurrentUserMessages = (newMessage: SingleMessage) => {
    setCurrentUserMessages([...currentUserMessages, newMessage])
  }

  const overwriteCurrentUserMessages = (newMessages: SingleMessage[]) => {
    setCurrentUserMessages(newMessages);
  }

  const updateActiveUsers = (newActiveUsers: ActiveUser[]) => {
    setActiveUsers(newActiveUsers);
  }

  const updateActiveGroupChats = (newGroupChat: ActiveUser[]) => {
    setActiveGroupChats([...activeGroupChats, newGroupChat]);
  }

  useEffect(() => {

    if(username === '') {
      history.push('/');
      return;
    }
  });

  const style = {
    height: '100%'
  }
  
  return (    
    <div>
      <h2> {`Logged in as: ${username}`} </h2>
      <div style={style}>
        <Grid container spacing={3}>
          <Grid item xs={3} >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ActiveUsersList 
                  updateSelectedUser={updateSelectedUser} 
                  selectedUser={selectedUser}
                  overwriteCurrentUserMessages={overwriteCurrentUserMessages}
                  currentUserMessages={currentUserMessages}
                  activeUsers={activeUsers}
                  updateActiveUsers={updateActiveUsers}
                />  
              </Grid>
              <Grid item xs={12}>
                <GroupChatsList
                  activeUsers={activeUsers}
                  activeGroupChats={activeGroupChats}
                  updateActiveGroupChats={updateActiveGroupChats}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} >
            <ChatTextbox  
              selectedUser={selectedUser} 
              updateCurrentUserMessages={updateCurrentUserMessages}
              currentUserMessages={currentUserMessages}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
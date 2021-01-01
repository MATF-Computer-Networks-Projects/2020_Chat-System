import React, { useState, useEffect } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { addNewChat, updateSingleChat } from '../store/actionCreators';
import { useHistory } from 'react-router-dom';
import ActiveUsersList from './ActiveUsersList';
import GroupChatsList from './GroupChatsList';
import ChatTextbox from './ChatTextbox';
import DisconnectComponent from './DiconnectComponent';
import Grid from '@material-ui/core/Grid';
import { 
  ActiveUser,
  Chat,
  UserState
} from '../types';


export default function Home () {  
  const history = useHistory();
  const dispatch = useDispatch();

  const currentUser = useSelector(
    (state: UserState) => state.currentUser,
    shallowEqual
  );
  
  const addNewChatCallback = React.useCallback(
    (newChat: Chat) => dispatch(addNewChat(newChat)),
    [dispatch]
  )

  const updateSingleChatCallback = React.useCallback(
    (updatedChat: Chat) => dispatch(updateSingleChat(updatedChat)),
    [dispatch]
  )

  const [selectedChat, setSelectedChat] = useState<Chat>();
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>();


  const updateSelectedChat = (newSelectedChat: Chat) => {
    setSelectedChat(newSelectedChat);
  }

  const updateActiveUsers = (newActiveUsers: ActiveUser[]) => {
    setActiveUsers(newActiveUsers);
  }

  const updateCurrentUserChats = (newChat: Chat) => {
    addNewChatCallback(newChat)
  }

  const updateSingleUserChat = (updatedChat: Chat) => {
    updateSingleChatCallback(updatedChat);
  }

  useEffect(() => {

    if(currentUser.username === '') {
      history.push('/');
      return;
    }
  });

  const style = {
    height: '100%'
  }
  
  return (    
    <div>
      <h2> {`Logged in as: ${currentUser.username}`} </h2>
      <div style={style}>
        <Grid container spacing={3}>
          <Grid item xs={3} >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ActiveUsersList 
                  updateSelectedChat={updateSelectedChat} 
                  selectedChat={selectedChat}
                
                  activeUsers={activeUsers}
                  updateActiveUsers={updateActiveUsers}

                  updateCurrentUserChats={updateCurrentUserChats}
                  updateSingleUserChat={updateSingleUserChat}

                />  
              </Grid>
              <Grid item xs={12}>
                <GroupChatsList
                  updateSelectedChat={updateSelectedChat} 
                  selectedChat={selectedChat}
                
                  activeUsers={activeUsers}
                  updateActiveUsers={updateActiveUsers}

                  updateCurrentUserChats={updateCurrentUserChats}
                  updateSingleUserChat={updateSingleUserChat}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} >
            <ChatTextbox  
              selectedChat={selectedChat} 
              updateSingleUserChat={updateSingleUserChat}
            />
          </Grid>
          <Grid item xs={3}>
            <DisconnectComponent
              updateCurrentUserChats={updateCurrentUserChats}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
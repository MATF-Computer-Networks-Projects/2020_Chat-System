import React, { useState, useEffect } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { addNewChat } from '../store/actionCreators';
import { useHistory } from 'react-router-dom';
import ActiveUsersList from './ActiveUsersList';
import GroupChatsList from './GroupChatsList';
import ChatTextbox from './ChatTextbox';
import Grid from '@material-ui/core/Grid';
import { 
  ActiveUser,
  SingleMessage,
  Chat,
  UserState
} from '../types';
import * as chat from '../utils/chat';



export default function Home () {  
  const history = useHistory();
  const dispatch = useDispatch();

  const currentUser = useSelector(
    (state: UserState) => state.currentUser,
    shallowEqual
  );

  const currentUserChats = useSelector(
    (state: UserState) => state.currentUserChats,
    shallowEqual
  );
  
  const addNewChatCallback = React.useCallback(
    (newChat: Chat) => dispatch(addNewChat(newChat)),
    [dispatch]
  )

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

  const updateCurrentUserChats = (newChat: Chat) => {
    addNewChatCallback(chat.prepareChatForSaving(newChat));
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
  
  console.log('currentUserChatsHOME: ', currentUserChats);

  return (    
    <div>
      <h2> {`Logged in as: ${currentUser.username}`} </h2>
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

                  updateCurrentUserChats={updateCurrentUserChats}
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
import React, { useState, useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ActiveUsersList from './ActiveUsersList';
import ChatTextbox from './ChatTextbox';
import Grid from '@material-ui/core/Grid';
import { ActiveUser } from '../types';


export default function Home () {  
  const history = useHistory();

  const username = useSelector(
    (state: UserState) => state.username,
    shallowEqual
  );

  const userId = useSelector(
    (state: UserState) => state.userId,
    shallowEqual
  );

  const [selectedUser, setSelectedUser] = useState<ActiveUser>();

  const updateSelectedUser = (newSelectedUser: ActiveUser) => {
    setSelectedUser(newSelectedUser);
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
      <h2>Home </h2>
      <div style={style}>
        <Grid container spacing={3}>
          <Grid item xs={3} >
            <ActiveUsersList updateSelectedUser={updateSelectedUser}/>  
          </Grid>
          <Grid item xs={6} >
            <ChatTextbox  selectedUser={selectedUser}/>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
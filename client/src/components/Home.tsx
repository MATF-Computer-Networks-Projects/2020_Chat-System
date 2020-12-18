import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ActiveUsersList from './ActiveUsersList';
import ChatTextbox from './ChatTextbox';
import Grid from '@material-ui/core/Grid';

interface Props {
  userId: string
}

export default function Home ({ userId }: Props) {  
  const history = useHistory();

  const username = useSelector(
    (state: UserState) => state.username,
    shallowEqual
  );

  useEffect(() => {

    if(username === "") {
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
            <ActiveUsersList userId = {userId}/>  
          </Grid>
          <Grid item xs={6} >
            <ChatTextbox />
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
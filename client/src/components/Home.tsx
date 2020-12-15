import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ActiveUsersList from './ActiveUsersList';
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

  return (    
    <div>
      <h2>Home </h2>
      <div>
        <Grid container spacing={3}>
          <Grid item xs={3} >
            <ActiveUsersList userId = {userId}/>  
          </Grid>
          <Grid item xs={6} >
            
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ActiveUsersList from './ActiveUsersList';

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
        <ActiveUsersList userId = {userId}/>
      </div>
    </div>
  )
}
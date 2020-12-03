import React, { FormEvent } from 'react';
import { useHistory} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '../store/actionCreators';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { asyncConnect } from '../utils/index';


type FormUser = {
  username: string
}

export default function RegisterUser() {  
  
  const dispatch = useDispatch();

  const addUserCallback = React.useCallback(
    (user: IUser) => dispatch(addUser(user)),
    [dispatch]
  )

  const [user, setUser] = React.useState<FormUser>();
  const history = useHistory();
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const socket = await asyncConnect();

    
    console.log('Stigao ovde');
    
    if(!user) {
      throw new Error('user is undefined');
    }

    addUserCallback({
      id: uuidv4(),
      socketId: socket.id,
      username: user.username
    });
    
    
    history.push('/home')
  }

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      username: e.currentTarget.value,
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter username</h2>

      <input 
        type='text'
        id='username'
        onChange={handleInputChange} 
      />

      <button type="submit">Submit</button>
    </form>
  )
}
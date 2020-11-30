import React, { FormEvent } from 'react';
import { useHistory} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '../store/actionCreators';
import { Dispatch } from 'redux';

export default function RegisterUser() {  
  
  const dispatch = useDispatch();

  const addUserCallback = React.useCallback(
    (user: IUser) => dispatch(addUser(user)),
    [dispatch]
  )

  const [user, setUser] = React.useState<IUser | {}>();
  const history = useHistory();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    console.log('test')
    addUserCallback({
      id: 'whatever',
      socketId: 'whatever vol 2',
      username: 'test username'
    });
    event.preventDefault();
    
    history.push('/home')
  }

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.currentTarget.id]: e.currentTarget.value,
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
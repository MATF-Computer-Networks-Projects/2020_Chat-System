import React, { FormEvent } from 'react';
import { RouteComponentProps } from 'react-router-dom';


interface RegisterUserProps extends RouteComponentProps {
  addUser: (user: IUser) => void
}

export default function RegisterUser (props: RegisterUserProps) {  
  
  const [user, setUser] = React.useState<IUser | {}>();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) {
    console.log('test')
    props.addUser({
      id: 'whatever',
      socketId: 'whatever vol 2',
      username: 'test username'
    });
    props.history.push('/home')
    // event.preventDefault();
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
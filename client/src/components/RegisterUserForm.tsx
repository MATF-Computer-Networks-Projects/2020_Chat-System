import React, { FormEvent } from 'react';
import { RouteComponentProps } from 'react-router-dom';


export default function RegisterUserForm (props: RouteComponentProps) {  
  
  function handleSubmit (event: FormEvent<HTMLFormElement>) {
    console.log('test')
    props.history.push('/home')
    // event.preventDefault();
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter username</h2>

      <input />

      <button type="submit">Submit</button>
    </form>
  )
}
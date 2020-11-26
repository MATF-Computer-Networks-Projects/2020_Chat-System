import React, { FormEvent } from 'react';


export default function RegisterUserForm () {  
  
  function handleSubmit (event: FormEvent<HTMLFormElement>) {
    console.log('test')
    event.preventDefault();
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter username</h2>

      <input />

      <button type="submit">Submit</button>
    </form>
  )
}
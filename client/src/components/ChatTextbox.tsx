
import { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export default function ChatTextbox() {

  const [message, setMessage] = useState('');
  const [currentUserMessages, setCurrentUserMessages] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if(message === '') {
      return;
    }

    setCurrentUserMessages([...currentUserMessages, message]);
    setMessage('');

  }

  return (
    <form onSubmit={handleSubmit}>
    <Grid container spacing={3}>
      <Grid item xs={10} >
        <TextField
          id='message-input-field'
          placeholder='Type your message here'
          value={message}
          onChange={handleInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={2} >
        <Button
          type='submit'
          fullWidth
        >
          Send
        </Button>
      </Grid>
    </Grid>
    </form>
    
  )
}
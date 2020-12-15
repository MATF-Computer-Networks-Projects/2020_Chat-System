
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export default function ChatTextbox() {

  return (
    <Grid container spacing={3}>
      <Grid item xs={10} >
        <TextField
          id='message-input-field'
          placeholder='Type your message here'
          fullWidth
        />
      </Grid>
      <Grid item xs={2} >
        <Button
          fullWidth
        >
          Send
        </Button>
      </Grid>
    </Grid>
    
  )
}
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';


export default function GroupChatsList() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
          <h2>Group chats: </h2>
      </Grid>
      <Grid item xs={12}>
        <h2>Display group chats here</h2>
      </Grid>
      <Grid item xs={12}>
        <Button
          fullWidth
        >
          + Create new group
        </Button>
      </Grid>
    </Grid>
  )
}
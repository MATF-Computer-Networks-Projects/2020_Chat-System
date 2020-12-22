import { 
  Button, 
  Grid,
  ListItem,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormGroup
} from '@material-ui/core';
import { ActiveUser } from '../types';
import { shallowEqual, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  activeUsers: ActiveUser[] | undefined
}

export default function GroupChatsList(props: Props) {
  
  const userId = useSelector(
    (state: UserState) => state.userId,
    shallowEqual
  );

  const generateActiveUsersCheckboxList = () => {
    if(!props.activeUsers) {
      return
    }
    return (
      <FormControl component="fieldset">
        <FormGroup>
          {
            props.activeUsers
            .filter(user => user.userId !== userId)
            .map(user => (
              <ListItem id={uuidv4()}>
                <FormControlLabel
                  control={<Checkbox/>}
                  label={user.username}
                />
              </ListItem>
              )
            )
          }
        </FormGroup>
      </FormControl>
    )
  }
  
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
      <Grid item xs={12}>
        {generateActiveUsersCheckboxList()}
      </Grid>
    </Grid>
  )
}
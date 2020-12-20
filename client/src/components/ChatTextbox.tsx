
import { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { v4 as uuidv4 } from 'uuid';
import { ActiveUser } from '../types';
import { useSocket } from '../contexts/SocketProvider';
import { shallowEqual, useSelector } from 'react-redux';
import { 
  socketEvents,
  ReceiveMessagesMessage
} from '../types';

interface Props {
  selectedUser: ActiveUser | undefined
}

export default function ChatTextbox(props: Props) {
  const socket = useSocket();
  const userId = useSelector(
    (state: UserState) => state.userId,
    shallowEqual
  );

  const [message, setMessage] = useState('');
  const [currentUserMessages, setCurrentUserMessages] = useState<string[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  useEffect(() => {
    console.log('RECEIVER: ', socketEvents.RECEIVE_MESSAGE + userId);

    if(!socket) {
      return;
    }

    socket.on(socketEvents.RECEIVE_MESSAGE + userId, (data: ReceiveMessagesMessage) => {
      console.log('received message: ', data)
      setReceivedMessages([...receivedMessages, data.message])
    })
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if(message === '') {
      return;
    }

    setCurrentUserMessages([...currentUserMessages, message]);
    socket.emit(socketEvents.SEND_MESSAGE, {
      senderId: userId, 
      recipientId: props.selectedUser?.userId,
      message
    })
    setMessage('');
  }

  const generateInputFieldAndButton = () => {
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

  const generateMessageBox = () => {    
    return (
      <Paper>
        <Grid container spacing={3}>
          {
            currentUserMessages.map(message => {
              return (
                <Grid item xs={12} id={uuidv4()}>
                  <Box p={2} textAlign="right">
                    {message}
                  </Box>
                </Grid>
              )
            })
          }
        </Grid>
        <Grid container spacing={3}>
          {
            receivedMessages.map(message => {
              return (
                <Grid item xs={12} id={uuidv4()}>
                  <Box p={2} textAlign="left">
                    {message}
                  </Box>
                </Grid>
              )
            })
          }
        </Grid>
      </Paper>
    )
  }

  const generateUserNotSelectedMessage = () => {
    return (
      <div>
        Please select the user to start chatting
      </div>
    )
  }

  console.log('currently selected user: ', props.selectedUser);

  if(!props.selectedUser) {
    return (
      <div>
        {generateUserNotSelectedMessage()}
      </div>
    )
  }

  return (
    <div>
      <Box>
        {`Chatting with: ${props.selectedUser.username}`}
      </Box>
      <Box marginBottom={5}>
        {generateMessageBox()}
      </Box>
      <Box>
        {generateInputFieldAndButton()}
      </Box>
    </div>
  )
}
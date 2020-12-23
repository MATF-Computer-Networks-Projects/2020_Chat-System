
import { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { v4 as uuidv4 } from 'uuid';
import { useSocket } from '../contexts/SocketProvider';
import { shallowEqual, useSelector } from 'react-redux';
import { 
  socketEvents,
  SingleMessage,
  ActiveUser,
} from '../types';

interface Props {
  selectedUser: ActiveUser | undefined
  updateCurrentUserMessages: Function
  currentUserMessages: SingleMessage[]
}

export default function ChatTextbox(props: Props) {
  const socket = useSocket();
  const userId = useSelector(
    (state: UserState) => state.userId,
    shallowEqual
  );

  const [message, setMessage] = useState('');

  useEffect(() => {

    if(!socket) {
      return;
    }

    socket.on(socketEvents.RECEIVE_MESSAGE + userId, (data: SingleMessage) => {
      const newMessage: SingleMessage = {
        senderId: data.senderId,
        recipientId: data.recipientId,
        message: data.message,
        timestampUTC: data.timestampUTC,
        seen: data.seen,
      }
      props.updateCurrentUserMessages(newMessage)
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

    if(!props.selectedUser || !props.selectedUser.userId) {
      return
    }

    const newMessage: SingleMessage = {
      senderId: userId,
      recipientId: props.selectedUser.userId,
      message,
      timestampUTC: Date.now(),
      seen: false,
    }

    props.updateCurrentUserMessages(newMessage)
    socket.emit(socketEvents.SEND_MESSAGE, newMessage)
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
    
    const filteredMessages = props.currentUserMessages
      .filter(msg => 
        (msg.senderId === userId && msg.recipientId === props.selectedUser?.userId) ||
        (msg.senderId === props.selectedUser?.userId)
      )
      .sort((msg1, msg2) => msg1.timestampUTC - msg2.timestampUTC)

    return (
      <Paper>
        <Grid container spacing={3}>
          {
            filteredMessages.map(message => {
              const alignment = message.senderId === userId ? "right" : "left";
              return (
                <Grid item xs={12} id={uuidv4()}>
                  <Box p={2} textAlign={alignment}>
                    {message.message}
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

  if(!props.selectedUser && props.currentUserMessages === []) {
    return (
      <div>
        {generateUserNotSelectedMessage()}
      </div>
    )
  }

  const displayText = props.selectedUser ? `Chatting with: ${props.selectedUser.username }` : 'Select user to start chatting';

  return (
    <div>
      <Box>
        {displayText}
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
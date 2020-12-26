
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
  UserState,
  Chat,
} from '../types';
import * as chat from '../utils/chat';

interface Props {
  selectedUser: ActiveUser | undefined
  updateSingleUserChat: Function
}

export default function ChatTextbox(props: Props) {
  const socket = useSocket();
  const currentUser = useSelector(
    (state: UserState) => state.currentUser,
    shallowEqual
  );

  const currentUserChats = useSelector(
    (state: UserState) => state.currentUserChats,
    shallowEqual
  );


  const [message, setMessage] = useState('');

  const addNewMessageToChat = (newMessage: SingleMessage) => {
    const chatForUpdate = chat.findChatByUsers(currentUserChats, [...newMessage.receivers, newMessage.sender])
    
    console.log('chatForUpdateKURCINA: ', chatForUpdate);
    if(!chatForUpdate) {
      return
    }

    const updatedChat: Chat = {
      ...chatForUpdate,
      messages: [...chatForUpdate.messages, newMessage]
    }

    console.log('addNewMessageToChat->updatedChat: ', updatedChat);

    props.updateSingleUserChat(updatedChat);
  }


  useEffect(() => {

    if(!socket) {
      return;
    }

    socket.on(socketEvents.RECEIVE_MESSAGE + currentUser.userId, (data: SingleMessage) => {
      const newMessage: SingleMessage = {
        sender: data.sender,
        receivers: data.receivers,
        message: data.message,
        timestampUTC: data.timestampUTC,
        seen: data.seen,
      }
      console.log('RECEIVE_MESSAGE: ', socketEvents.RECEIVE_MESSAGE + currentUser.userId)
      console.log('received new message: ', data);
      addNewMessageToChat(newMessage);
    })
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
  }

  const handleSend = () => {
    if(message === '') {
      return;
    }

    if(!props.selectedUser || !props.selectedUser.userId) {
      return
    }

    const newMessage: SingleMessage = {
      sender: currentUser,
      receivers: [props.selectedUser],
      message,
      timestampUTC: Date.now(),
      seen: false,
    }

    addNewMessageToChat(newMessage)
    socket.emit(socketEvents.SEND_MESSAGE, newMessage)
    setMessage('');
  }

  const generateInputFieldAndButton = () => {
    return (
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
            onClick={handleSend}
          >
            Send
          </Button>
        </Grid>
      </Grid>
    )  
  }

  const generateMessageBox = () => {    
    
    if (!props.selectedUser) {
      return;
    }

    const currentChat = chat.findChatByUsers(currentUserChats, [currentUser, props.selectedUser]);
    console.log('generateMessageBox->currentChat: ', currentChat)
    
    if (!currentChat) {
      return;
    }


    const sortedMessages = currentChat.messages
      .sort((msg1, msg2) => msg1.timestampUTC - msg2.timestampUTC)

    return (
      <Paper>
        <Grid container spacing={3}>
          {
            sortedMessages.map(message => {
              const alignment = JSON.stringify(message.sender) === JSON.stringify(currentUser) ? "right" : "left";
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

  if(!props.selectedUser) {
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
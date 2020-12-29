
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
  UserState,
  Chat,
} from '../types';
import * as chatUtils from '../utils/chat';
import * as fileUtils from '../utils/files';

interface Props {
  selectedChat: Chat | undefined
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
  const [currentFile, setCurrentFile] = useState<File>();
  const [fileSelected, setFileSelected] = useState(false);
  const [imgString, setImgString] = useState('');

  const addNewMessageToChat = (newMessage: SingleMessage) => {
    if (newMessage.type !== 'text') {
      setImgString(newMessage.message as string)
      

      return
    }
    const chatForUpdate = chatUtils.findChatByUsers(currentUserChats, [...newMessage.receivers, newMessage.sender])
    if(!chatForUpdate) {
      return
    }

    const updatedChat: Chat = {
      ...chatForUpdate,
      messages: [...chatForUpdate.messages, newMessage]
    }
    props.updateSingleUserChat(updatedChat);
  }


  useEffect(() => {

    if(!socket) {
      return;
    }

    socket.on(socketEvents.RECEIVE_MESSAGE + currentUser.userId, (data: SingleMessage) => {
      console.log('RECEIVE_MESSAGE: ', data)
      const newMessage: SingleMessage = {
        sender: data.sender,
        receivers: data.receivers,
        message: data.message,
        timestampUTC: data.timestampUTC,
        seen: data.seen,
        type: data.type,
      }
      addNewMessageToChat(newMessage);
    })
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
  }

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if(message === '' && !fileSelected) {
      return;
    }

    if(!props.selectedChat) {
      return
    }

    const receivers = props.selectedChat.users.filter(u => u.userId !== currentUser.userId)


    if(message !== '') {
      const newMessage: SingleMessage = {
        sender: currentUser,
        receivers,
        message,
        timestampUTC: Date.now(),
        seen: false,
        type: 'text',
      }

      addNewMessageToChat(newMessage)
      socket.emit(socketEvents.SEND_MESSAGE, newMessage)
      setMessage('');
    }

    currentFile?.arrayBuffer().then(buffer => {
      const newMessage: SingleMessage = {
        sender: currentUser,
        receivers,
        message: Buffer.from(buffer).toString('base64'),
        timestampUTC: Date.now(),
        seen: false,
        type: fileUtils.determineFileType(currentFile as File),
      }
  
        addNewMessageToChat(newMessage)
        console.log('emittiong')
        socket.emit(socketEvents.SEND_MESSAGE, newMessage)
    })
  }

  const handleFileInput = (e: { target: { files: any; }; }) => {
    console.log('file selected: ', e.target.files)
    setCurrentFile(e.target.files[0])
    setFileSelected(true)
  }

  const generateInputFieldAndButtons = () => {
    return (
      <form onSubmit={handleSend}>
      <Grid container spacing={3}>
        <Grid item xs={8} >
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
        <Grid item xs={2} >
          <input type='file' onChange={handleFileInput} accept='.txt, .jpg'/>
        </Grid>
      </Grid>
      </form>
    )  
  }


  const formatMessage = (message: SingleMessage) => {
    //if (message.type === 'text') {
      return message.message
    // }

    // return (
    //   generateDownloadDialog(message.message as File)
    // )
  }

  const generateMessageBox = () => {    
    
    if (!props.selectedChat) {
      return;
    }

    const currentChat = chatUtils.findChatByUsers(currentUserChats, props.selectedChat.users);
    
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
              const sender = (alignment === "right" ?  'You' : message.sender.username)
              return (
                <Grid item xs={12} key={uuidv4()}>
                  <Box p={2} textAlign={alignment}>
                    <span><b>{sender + ': '}</b>  {formatMessage(message)}</span>
                  </Box>
                </Grid>
              )
            })
          }
        </Grid>
      </Paper>
    )
  }


  const generateDownloadDialog = (blob: Blob) => {
    
    console.log('blob: ', blob)
    const fileDownloadUrl = URL.createObjectURL(blob)

    return (
      <a
        href={fileDownloadUrl}
        download
      > 
        {uuidv4()} 
      </a>
    )

  }

  const generateImgComponent = () => {
    console.log('generateImgComponent: ', imgString)
    if (imgString === '') {
      return;
    }
    return (
      <img src={`data:image/png;base64, ${imgString}` }/>
    )
    

  }

  if(!props.selectedChat) {
    return (
      <div>
        Please select chat to start chatting.
      </div>
    )
  }

  const displayText = props.selectedChat ? `Chatting with: ${ chatUtils.createPrettyChattingWithMessage(props.selectedChat, currentUser) }` : 'Select user to start chatting';

  return (
    <div>
      <Box>
        {displayText}
      </Box>
      <Box marginBottom={5}>
        {generateMessageBox()}
      </Box>
      <Box>
        {generateInputFieldAndButtons()}
      </Box>
      <Box>
        {generateImgComponent()}
      </Box>
    </div>
  )
}
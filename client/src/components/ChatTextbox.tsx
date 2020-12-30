
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
  const [selectedFile, setSelectedFile] = useState<File>();
  // const [fileSelected, setFileSelected] = useState(false);
  const [uploadClicked, setUploadClicked] = useState(false);

  const addNewMessageToChat = (newMessage: SingleMessage) => {
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
      const newMessage: SingleMessage = {
        sender: data.sender,
        receivers: data.receivers,
        message: data.message,
        timestampUTC: data.timestampUTC,
        seen: data.seen,
        type: data.type,
        name: data.name
      }
      addNewMessageToChat(newMessage);
    })
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
  }

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if(message === '' && !selectedFile) {
      return;
    }

    if(!props.selectedChat) {
      return
    }

    const receivers = props.selectedChat.users.filter(u => u.userId !== currentUser.userId)


    if(!selectedFile) {
      const newMessage: SingleMessage = {
        sender: currentUser,
        receivers,
        message,
        timestampUTC: Date.now(),
        seen: false,
        type: 'text',
        name: 'text-message',
      }

      addNewMessageToChat(newMessage)
      socket.emit(socketEvents.SEND_MESSAGE, newMessage)
      setMessage('');
    } else {
      selectedFile?.arrayBuffer().then(buffer => {
        const newMessage: SingleMessage = {
          sender: currentUser,
          receivers,
          message: Buffer.from(buffer).toString('base64'),
          timestampUTC: Date.now(),
          seen: false,
          type: fileUtils.determineFileType(selectedFile as File),
          name: selectedFile.name,
        }
    
          addNewMessageToChat(newMessage)
          socket.emit(socketEvents.SEND_MESSAGE, newMessage)
          setSelectedFile(undefined)
          setUploadClicked(false)
      })
    }    
  }

  const handleFileInput = (e: { target: { files: any; }; }) => {
    setSelectedFile(e.target.files[0])
  }

  const generateFileUploadComponents = () => {
    if (!uploadClicked) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button
              fullWidth
              onClick={() => setUploadClicked(true)}
            >
              Upload
          </Button>
          </Grid>
        </Grid>
      )
    }
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <input type='file' onChange={handleFileInput} accept='.txt, .jpg'/>
        </Grid>
        <Grid item xs={12}>
        <Button
            fullWidth
            onClick={() => {
              setUploadClicked(false)
              setSelectedFile(undefined)
            }}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    )
  }

  const generateInputFieldAndButtons = () => {
    return (
      <form onSubmit={handleSend}>
      <Grid container spacing={3}>
        <Grid item xs={8} >
          <TextField
            id='message-input-field'
            placeholder={!selectedFile ? 'Type your message here' : 'Please send file first'}
            disabled={!selectedFile ? false : true}
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
          {generateFileUploadComponents()}
        </Grid>
      </Grid>
      </form>
    )  
  }

  
  const generateDownloadDialog = (message: SingleMessage) => {
    const text = Buffer.from(message.message as string, 'base64').toString('utf-8')
    const file = new File([text], uuidv4(), {type: 'text/plain'})
    
    const fileDownloadUrl = URL.createObjectURL(file)

    return (
      <a
        href={fileDownloadUrl}
        download
      > 
        {message.name} 
      </a>
    )
  }

  const generateImgComponent = (message: SingleMessage) => {
    const imgString = message.message
    
    return (
      <img alt={message.name} src={`data:image/jpg;base64, ${imgString}`} width='30%' height='30%'/>
    )
  }

  const formatMessage = (message: SingleMessage) => {
    switch(message.type) {
      case 'file':
        return generateDownloadDialog(message)
        
      case 'image':
        return generateImgComponent(message)
      
      default:
        return message.message
    }
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
    </div>
  )
}
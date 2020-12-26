import {
  ActiveUser,
  Chat
} from '../types';

const getSortedUsernamesFromChat = (chat: Chat): string[] => {
  return chat.users.map(user => user.username).sort();
}

export const chatAlreadyExists = (currentUserChats: Chat[], newChat: Chat): boolean => {
  const newChatUsernames = getSortedUsernamesFromChat(newChat);

  let check = false ;
  currentUserChats.forEach(chat => {
    const chatUsernames = getSortedUsernamesFromChat(chat);
    if (JSON.stringify(newChatUsernames) === JSON.stringify(chatUsernames)) {
      check = true;
    }
  })
  return check
}

export const updateSingleChat = (currentUserChats: Chat[], updatedChat: Chat): Chat[] => {
  return currentUserChats.map(chat => {
    const chatUsernames = getSortedUsernamesFromChat(chat)
    const updatedChatUsernames = getSortedUsernamesFromChat(updatedChat)
    
    if(JSON.stringify(chatUsernames) === JSON.stringify(updatedChatUsernames)) {
      return updatedChat
    } 
    return chat
  })
}

export const findChatByUsers = (currentUserChats: Chat[], users: ActiveUser[]): Chat | undefined => {
  const sortedUsernames = users.map(user => user.username).sort();
  let toReturn;
  currentUserChats.forEach(chat => {
    const chatUsernames = getSortedUsernamesFromChat(chat)

    if(JSON.stringify(chatUsernames) === JSON.stringify(sortedUsernames)) {
      toReturn = chat;

    } 
  })
  return toReturn;
}
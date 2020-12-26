import {
  Chat
} from '../types';

const getSortedUsernamesFromChat = (chat: Chat): string[] => {
  return chat.users.map(user => user.username).sort();
}

export const chatAlreadyExists = (currentUserChats: Chat[], newChat: Chat): boolean => {
  console.log('currentUserChatsCHAT: ', currentUserChats);
  console.log('newChat: ', newChat);

  const newChatUsernames = getSortedUsernamesFromChat(newChat);

  let check = false ;
  currentUserChats.forEach(chat => {
    const chatUsernames = getSortedUsernamesFromChat(chat);
    console.log('newChatUsernames: ', newChatUsernames)
    console.log('chatUsernames: ', chatUsernames)

    if (JSON.stringify(newChatUsernames) === JSON.stringify(chatUsernames)) {
      check = true;
    }
  })

  console.log('chatAlreadyExists: ', check);

  return check
}
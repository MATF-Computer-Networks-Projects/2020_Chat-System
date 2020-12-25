import {
  ActiveUser,
  Chat
} from '../types';

const cmpUsers = (a: ActiveUser, b: ActiveUser): number => {
  if (a.username < b.username) {
    return -1
  }
  if (a.username > b.username) {
    return 1
  }
  return 0
} 

function arraysAreEqual<T> (arr1: Array<T>, arr2: Array<T>): boolean {
  
  console.log('comparing: ', arr1);
  console.log('comparing: ', arr2);
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

const getSortedUsernamesFromChat = (chat: Chat): string[] => {
  return chat.users.map(user => user.username).sort();
}

export const prepareChatForSaving = (groupChat: Chat): Chat => {
  const sortedUsers = groupChat.users.sort(cmpUsers)
  return {
    ...groupChat,
    users: sortedUsers
  }
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
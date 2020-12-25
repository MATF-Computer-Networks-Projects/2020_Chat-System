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
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

export const prepareChatForSaving = (groupChat: Chat): Chat => {
  const sortedUsers = groupChat.users.sort(cmpUsers)
  return {
    ...groupChat,
    users: sortedUsers
  }
}

export const chatAlreadyExists = (currentUserChats: Chat[], newChat: Chat): boolean => {
  console.log('chatAlreadyExists')
  console.log('currentUserChats: ', currentUserChats);
  console.log('newChat: ', newChat);

  currentUserChats.forEach(chat => {
    if (arraysAreEqual(chat.users, newChat.users)) {
      return true
    }
  })
  return false
}
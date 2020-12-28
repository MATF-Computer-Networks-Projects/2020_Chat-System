import {
  ActiveUser,
  Chat,
} from '../types';

import * as chatUtils from './chat';

export const hasUnseenMessagesFromCurrentChat = (currentChat: Chat, currentUserChats: Chat[], currentUser: ActiveUser) => {
  const targetChat = chatUtils.findChatByUsers(currentUserChats, currentChat.users)
  if (!targetChat) {
    return false 
  }

  if (targetChat.messages.find(msg => msg.sender.userId !== currentUser.userId && msg.seen === false)) {
    return true;
  }

  return false;
}

export const handleChatClick = (newSelectedChat: Chat, currentUserChats: Chat[], 
  updateSingleUserChat: Function, updateSelectedChat: Function) => {
  const targetChat = chatUtils.findChatByUsers(currentUserChats, newSelectedChat.users)
  if (!targetChat) {
    return
  }

  const updatedChatMessages = targetChat.messages.map(msg => {
    return {...msg, seen: true}
  });

  const updatedChat = {
    ...targetChat,
    messages: updatedChatMessages
  }

  updateSingleUserChat(updatedChat);
  updateSelectedChat(newSelectedChat);
}
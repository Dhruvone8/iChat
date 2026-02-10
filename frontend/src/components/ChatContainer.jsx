import React, { useEffect } from 'react'
import { useChatStore } from '../store/ChatStore'
import { useAuthStore } from '../store/AuthStore'
import ChatHeader from './ChatHeader'

const ChatContainer = () => {

  const { selectedUser, getMessagesByUserId, messages } = useChatStore()
  const { authUser } = useAuthStore()

  useEffect(() => {
    getMessagesByUserId(selectedUser._id)
  }, [selectedUser, getMessagesByUserId])

  return (
    <>
    <ChatHeader />
    </>
  )
}

export default ChatContainer
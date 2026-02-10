import React from 'react'
import BorderAnimator from '../components/BorderAnimator'
import { useChatStore } from '../store/ChatStore'
import ProfileHeader from '../components/ProfileHeader'
import ActiveTabSwitcher from '../components/ActiveTabSwitcher'
import ChatsList from '../components/ChatsList'
import ContactList from '../components/ContactList'
import ChatContainer from '../components/ChatContainer'
import NoConversationPlaceholder from '../components/NoConversationPlaceholder'

const Chat = () => {

  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full max-w-6xl h-[690px]">
      <BorderAnimator>
        {/* LEFT SIDE */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitcher />
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimator>
    </div>
  )
}

export default Chat 
import React from 'react'
import { useChatStore } from '../store/ChatStore'

const ActiveTabSwitcher = () => {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="tabs tabs-box bg-transparent p-2 m-2 flex justify-around items-center">

      <button
        onClick={() => setActiveTab("chats")}
        className={`tab transition-all duration-300 rounded-lg
          ${activeTab === "chats"
            ? "bg-cyan-500/20 text-cyan-400 px-8 scale-105"
            : "text-slate-400 px-4"
          }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab transition-all duration-300 rounded-lg
          ${activeTab === "contacts"
            ? "bg-cyan-500/20 text-cyan-400 px-8 scale-105"
            : "text-slate-400 px-4"
          }`}
      >
        Contacts
      </button>

    </div>
  )
}

export default ActiveTabSwitcher

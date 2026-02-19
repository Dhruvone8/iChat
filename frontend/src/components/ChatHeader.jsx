import React, { useEffect } from 'react'
import { useChatStore } from '../store/ChatStore'
import { useAuthStore } from '../store/AuthStore'
import { XIcon } from 'lucide-react'

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const isOnline = onlineUsers.includes(selectedUser._id)

    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === "Escape") setSelectedUser(null)
        }
        window.addEventListener("keydown", handleEscKey)

        return () => {
            window.removeEventListener("keydown", handleEscKey)
        }
    }, [setSelectedUser])

    return (
        <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1">
            <div className="flex items-center space-x-3">
                <div className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}>
                    <div className="w-12 rounded-full">
                        <img src={selectedUser.profilePic || "./avatar.png"} alt={selectedUser.fullName} />
                    </div>
                </div>
                <div>
                    <h3 className="text-slate-200 font-medium">{selectedUser.fullName}</h3>
                    <p className="text-slate-400 text-sm">{isOnline ? "Online" : "Offline"}</p>
                </div>
            </div>

            <button onClick={() => setSelectedUser(null)} className="md:hidden">
                <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
            </button>
        </div>
    )
}

export default ChatHeader
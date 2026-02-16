import { create } from 'zustand';
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from './AuthStore';

const notificationSound = new Audio("/notification.mp3");

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled)
        set({ isSoundEnabled: !get().isSoundEnabled })
    },

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (user) => set({ selectedUser: user }),

    getAllContacts: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/contacts");
            set({ allContacts: res.data.contacts });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMyChatPartners: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/chats");
            set({ chats: res.data.chatUsers });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({ messages: res.data.messages })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get()
        const { authUser } = useAuthStore.getState()

        const tempId = `temp-${Date.now()}`

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
        };

        // Immediately update the UI
        set({
            messages: [...messages, optimisticMessage]
        })

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
            set({
                messages: get().messages.map(msg =>
                    msg._id === tempId
                        ? { ...msg, ...res.data.message, _id: tempId, serverId: res.data.message._id }
                        : msg
                )
            })
        } catch (error) {
            // Remove the message from the UI if there is error from the server
            set({ messages: get().messages.filter(msg => msg._id !== tempId) })
            toast.error("Failed to send message")
        }
    },

    subscribeToNewMessages: () => {
        const { selectedUser, isSoundEnabled } = get()
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", (message) => {
            const currentMessages = get().messages;
            set({ messages: [...currentMessages, message] })

            if (isSoundEnabled) {
                notificationSound.currentTime = 0;
                notificationSound.play().catch((e) => console.log("Audio Play Failed", e))
            }
        });
    },

    unsubscribeFromNewMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    }
}))
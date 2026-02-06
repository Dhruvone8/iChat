import { create } from 'zustand';
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast"

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({ authUser: res.data })
        } catch (error) {
            console.error("Error in checking auth", error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async(data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/register", data)
            set({authUser: res.data});

            toast.success("Account Created Successfully!")
        } catch (error) {
            console.error("Error in signup", error)
            toast.error("Error in signup")
        } finally {
            set({ isSigningUp: false })
        }
    }
}))

import { create } from 'zustand';
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast"

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,

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

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/register", data)
            set({ authUser: res.data });

            toast.success("Account Created Successfully!")
        } catch (error) {
            console.error("Error in signup", error)
            toast.error(error.response.data.message)
        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data });

            toast.success("Logged In Successfully!")
        } catch (error) {
            console.error("Error in login", error)
            toast.error(error.response.data.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async() => {
        try {
            await axiosInstance.post("/auth/logout")
            set({ authUser: null })
            toast.success("Logged Out Successfully!")
        } catch (error) {
            console.error("Error in logout", error)
            toast.error(error.response.data.message)
        }
    }
}))

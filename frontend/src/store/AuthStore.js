import { create } from 'zustand';
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const baseURL = import.meta.env.MODE === "development"
    ? "http://localhost:3000/"
    : import.meta.env.VITE_API_URL;

export const useAuthStore = create((set, get) => ({
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    authUser: null,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({ authUser: res.data });
            localStorage.setItem("authUser", JSON.stringify(res.data));
            get().connectSocket();

        } catch (error) {
            set({ authUser: null });
            localStorage.removeItem("authUser");
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/register", data);

            set({ authUser: res.data });
            localStorage.setItem("authUser", JSON.stringify(res.data)); // persist user

            toast.success("Account Created Successfully!");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);

            set({ authUser: res.data });
            localStorage.setItem("authUser", JSON.stringify(res.data)); // persist user

            toast.success("Logged In Successfully!");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");

            set({ authUser: null });
            localStorage.removeItem("authUser");
            toast.success("Logged Out Successfully!");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    },

    updateProfile: async (data) => {
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);

            const updatedUser = res.data.user;

            set({ authUser: updatedUser });
            localStorage.setItem("authUser", JSON.stringify(updatedUser));

            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Profile update failed");
        }
    },

    connectSocket: () => {
        const { authUser } = get();

        if (!authUser || get().socket?.connected) return;

        const socket = io(baseURL, { withCredentials: true });

        socket.connect();
        set({ socket });

        // Listen for online users event
        socket.on("onlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    }
}));

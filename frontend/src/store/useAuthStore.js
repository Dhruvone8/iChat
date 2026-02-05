import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    authUser: { name: "john", _id: 123, age: 21 },
    isLoading: false,

    login: () => {
        console.log("Logged In")
    }

}))

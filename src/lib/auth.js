// FILE: src/lib/auth.js

import { create } from 'zustand';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

// Helper function to get user from localStorage safely
const getInitialUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('vozz-os-user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

const useAuthStore = create((set) => ({
  user: getInitialUser(),
  loading: true,

  fetchUser: () => {
    // This function now simply verifies the initial state from localStorage
    // In a real app, you might re-validate the session token here
    set({ loading: false });
  },

  login: async (staffId) => {
    set({ loading: true });
    try {
      const userDocRef = doc(db, 'users', staffId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = {
          uid: userDoc.id,
          ...userDoc.data()
        };
        // Save user to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('vozz-os-user', JSON.stringify(userData));
        }
        set({ user: userData, loading: false });
      } else {
        throw new Error("User not found.");
      }

    } catch (error) {
      set({ user: null, loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    // Remove user from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vozz-os-user');
    }
    set({ user: null, loading: false });
  },
}));

export { useAuthStore };

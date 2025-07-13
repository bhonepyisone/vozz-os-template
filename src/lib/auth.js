// FILE: src/lib/auth.js
import { create } from 'zustand';
import { db, auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  fetchUser: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = { uid: userDoc.id, ...userDoc.data() };
          set({ user: userData, loading: false });
        } else {
          signOut(auth);
          set({ user: null, loading: false });
        }
      } else {
        set({ user: null, loading: false });
      }
    });
  },

  login: async (email, password, rememberMe) => {
    set({ loading: true });
    try {
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login failed:", error);
      set({ user: null, loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    await signOut(auth);
  },
}));

export { useAuthStore };

// Initialize auth state
useAuthStore.getState().fetchUser();
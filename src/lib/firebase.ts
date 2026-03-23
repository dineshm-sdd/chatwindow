import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your real Firebase config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDjhu1ibPPdepGBE5DXh_1UkKzIXE2sx98",
  authDomain: "chatwindow-ai.firebaseapp.com",
  projectId: "chatwindow-ai",
  storageBucket: "chatwindow-ai.firebasestorage.app",
  messagingSenderId: "750536279977",
  appId: "1:750536279977:web:455220a70bc3686bb9a6b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

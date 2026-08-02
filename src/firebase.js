import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyACkXS3ByuLJVJixtzMQxwD5Z2eUpjLdCE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "anikara-brand.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "anikara-brand",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "anikara-brand.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "397060864729",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:397060864729:web:4f0f79f75fe3d16de65cc8",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-D0627ZXMP9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, analytics, db, auth, storage };

import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { Platform } from "react-native";

// Firebase config (from your Firebase project settings)
const firebaseConfig = {
  apiKey: "AIzaSyBDI8IMdBq75ZqqVmkwr9l6ZLb8XbF4aag",
  authDomain: "runninghour-app.firebaseapp.com",
  projectId: "runninghour-app",
  storageBucket: "runninghour-app.firebasestorage.app",
  messagingSenderId: "1067308910387",
  appId: "1:1067308910387:web:455d5766b46859d602e046",
  measurementId: "G-H6L89XTWXW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Analytics (only works on Web)
let analytics;
if (Platform.OS === "web") {
  analytics = getAnalytics(app);
}
export { analytics };

// Initialize Auth (different for web vs React Native)
let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}
export { auth };

// Firestore & Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

// Example reference to "users" collection
export const usersRef = collection(db, "users");

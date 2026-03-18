// Replace the following config with your own from the Firebase Console
// Go to Project Settings -> General -> Your apps -> Web apps -> Config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "present-ad575.firebaseapp.com",
    projectId: "present-ad575",
    storageBucket: "present-ad575.firebasestorage.app",
    messagingSenderId: "603883050053",
    appId: "1:603883050053:web:235068bbdee76583fe7f2c",
    measurementId: "G-ZCSN0RXV0H"
};

// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);

// Initialize services
export const auth = firebase.auth();
export const db = firebase.firestore();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

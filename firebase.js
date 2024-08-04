// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "process.env.NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "pantrytracker-ff371.firebaseapp.com",
  projectId: "pantrytracker-ff371",
  storageBucket: "pantrytracker-ff371.appspot.com",
  messagingSenderId: "475838793036",
  appId: "1:475838793036:web:63b9a5e9dafdf1861dbbe9",
  measurementId: "G-3CV1NX4BRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {app, firestore};
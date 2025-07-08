// src/firebase.js

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// Your fixed Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAAN3_BEYmRZS_rcsQbPmuzj3IbFDSnKG0",
  authDomain: "pixora-clone.firebaseapp.com",
  projectId: "pixora-clone",
 storageBucket: "pixora-clone.appspot.com",

  messagingSenderId: "667213325436",
  appId: "1:667213325436:web:56aac60b33a123db1bd5f9"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Export Firebase services
export const db = firebaseApp.firestore();
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const storage = firebase.storage();
export const FieldValue = firebase.firestore.FieldValue;

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBWeMQInzeVufl9gPk5xc5nqpWjnN0b7u0",
  authDomain: "sikkha48.firebaseapp.com",
  projectId: "sikkha48",
  storageBucket: "sikkha48.firebasestorage.app",
  messagingSenderId: "786363342806",
  appId: "1:786363342806:web:9aa2aeb6b2e9301d120e77",
  measurementId: "G-6VRFYC059P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
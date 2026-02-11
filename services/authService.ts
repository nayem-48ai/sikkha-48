import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import { UserProfile, UserRole } from '../types';

export const loginUser = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);

export const registerUser = async (email: string, pass: string, username: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;
  
  const profile: UserProfile = {
    uid: user.uid,
    username,
    email,
    role: UserRole.USER,
    isApproved: false,
    createdAt: serverTimestamp()
  };

  await setDoc(doc(db, 'users', user.uid), profile);
  return profile;
};

export const logoutUser = () => signOut(auth);

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};
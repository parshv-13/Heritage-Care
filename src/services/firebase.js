import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC7n4JIRpru_u-vcIfS1tf-cRN8RrZeHsE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sih-game.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sih-game",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sih-game.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "260885303453",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:260885303453:web:f29db6df0f861dabfec474",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-X3BTWY5W0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Save user profile in Firestore
 */
export const saveUserProfile = async (user, additionalData = {}) => {
  if (!user) return;
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { displayName, email, phoneNumber, photoURL } = user;
    try {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: displayName || additionalData.name || 'Elderly User',
        email: email || '',
        phoneNumber: phoneNumber || additionalData.phone || '',
        photoURL: photoURL || '',
        createdAt: new Date().toISOString(),
        role: 'patient',
        region: 'Assam'
      });
      console.log('[Firebase] User profile created successfully');
    } catch (error) {
      console.error('[Firebase] Error creating user profile', error);
    }
  }
};

/**
 * Sync Game Session to Firestore Cloud Database
 */
export const saveGameSessionToFirebase = async (userId, sessionData) => {
  if (!userId) return;
  try {
    const historyRef = collection(db, 'users', userId, 'gameHistory');
    await addDoc(historyRef, {
      ...sessionData,
      createdAt: new Date().toISOString()
    });
    console.log('[Firebase Firestore] Saved game session to cloud!');
  } catch (error) {
    console.error('[Firebase Firestore] Error saving game session:', error);
  }
};

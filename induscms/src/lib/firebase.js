import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBfBJVZ0O3uA-bKExXyWBYlsCiah1kLOfo",
  authDomain: "induscms-565a9.firebaseapp.com",
  projectId: "induscms-565a9",
  storageBucket: "induscms-565a9.firebasestorage.app",
  messagingSenderId: "302296510599",
  appId: "1:302296510599:web:662319a02220a28fc40822",
  measurementId: "G-5687534GKN"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();

auth.languageCode = 'it';

const firebaseErrorMap = {
  "auth/email-already-in-use": "Email already registered.",
  "auth/invalid-email": "Email not valid.",
  "auth/password-does-not-meet-requirements": "Password must be at least 6 characters.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/missing-password": "Please enter your password.",
  "auth/too-many-requests": "Too many attempts.",
  "auth/network-request-failed": "Network error.",
  "auth/invalid-email": "The email address is badly formatted.",
  "auth/user-disabled": "This user account has been disabled.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/too-many-requests": "Too many failed attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Check your connection.",
  "auth/internal-error": "An unexpected error occurred. Please try again.",
  "auth/invalid-credential": "Invalid email or password.",
  "Invalid Email": "Invalid Email"
};

function translateErr(code) {
  let translation = 'An unexpected error occured.';
  for (let x of Object.keys(firebaseErrorMap)) {
    if (x === code) {
      translation = firebaseErrorMap[x];
    }
  }
  return translation;
}

export { auth, provider, translateErr, db };
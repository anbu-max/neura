import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDXQLH7Etlk2jUsXllgFNstLt0bWx2GSSo",
  authDomain: "neura-ai-793fb.firebaseapp.com",
  projectId: "neura-ai-793fb",
  storageBucket: "neura-ai-793fb.firebasestorage.app",
  messagingSenderId: "267094249630",
  appId: "1:267094249630:web:e140a765f012a20a126b8f",
  measurementId: "G-Y7ZVC80R7V",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

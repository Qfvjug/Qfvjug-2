import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Firebase-Konfiguration (wird später durch Umgebungsvariablen ersetzt)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "qfvjug-website.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://qfvjug-website-default-rtdb.firebaseio.com/",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "qfvjug-website",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "qfvjug-website.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);

// Services exportieren
export const database = getDatabase(app);
export const auth = getAuth(app);
export default app;


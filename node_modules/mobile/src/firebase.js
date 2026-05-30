import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración de Firebase para el Proyecto Malcom
// Puede reemplazarse por las variables de entorno reales del usuario
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyFakeKeyMalcomProyecto2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "malcom-proyecto.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "malcom-proyecto",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "malcom-proyecto.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://malcom-proyecto-default-rtdb.firebaseio.com"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

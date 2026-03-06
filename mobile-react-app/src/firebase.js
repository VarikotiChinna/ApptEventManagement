import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCc2qiMNMna9NMi9xFM_Q_KsVzAszvHU3g",
  authDomain: "sahasraserinity.firebaseapp.com",
  projectId: "sahasraserinity",
  storageBucket: "sahasraserinity.firebasestorage.app",
  messagingSenderId: "415737017300",
  appId: "1:415737017300:web:4a52715e68c0104e07dc41",
  measurementId: "G-49WLXY0JLP"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

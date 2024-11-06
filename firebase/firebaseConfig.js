import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, onSnapshot, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCvb3nSYrcJ_JexbkO_c6FDgrggOtAjptw",
  authDomain: "nexus-47d4e.firebaseapp.com",
  projectId: "nexus-47d4e",
  storageBucket: "nexus-47d4e.appspot.com",
  messagingSenderId: "322156513563",
  appId: "1:322156513563:web:16cfcb8d177cc1d1b1abbe",
  measurementId: "G-81FXBZR2KC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exporta todos os módulos necessários
export { db, collection, doc, onSnapshot, updateDoc, deleteDoc, addDoc };

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAZpZJNAMD5LDsO0iQ_owM-r1DxHG6Ir6g",
  authDomain: "fitnessbuddy-9fbd9.firebaseapp.com",
  projectId: "fitnessbuddy-9fbd9",
  storageBucket: "fitnessbuddy-9fbd9.firebasestorage.app",
  messagingSenderId: "435449142949",
  appId: "1:435449142949:web:ff6455d4f8fffcd14bb74c",
  measurementId: "G-J17BPMJ4YV",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
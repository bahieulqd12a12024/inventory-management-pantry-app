// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtftSZwHg5XynW8z1W7ltsnQlRkGayBD8",
  authDomain: "inventory-management-app-afa3b.firebaseapp.com",
  projectId: "inventory-management-app-afa3b",
  storageBucket: "inventory-management-app-afa3b.appspot.com",
  messagingSenderId: "656622543039",
  appId: "1:656622543039:web:2be4ca7487d505d5bba60a",
  measurementId: "G-LKT3LH7CMW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
export { firestore };
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAmxZTXqbs5yOH18BmpvuumaRjYZ200Uc",
  authDomain: "system-development-project.firebaseapp.com",
  projectId: "system-development-project",
  storageBucket: "system-development-project.appspot.com",
  messagingSenderId: "85880037208",
  appId: "1:85880037208:web:2111176c9055be19e2cf2d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
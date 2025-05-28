// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB966LQtDSGb2LnZ_jMHFMYsHfwjRviU18",
  authDomain: "websiteaddimage.firebaseapp.com",
  projectId: "websiteaddimage",
  storageBucket: "websiteaddimage.firebasestorage.app",
  messagingSenderId: "644122614522",
  appId: "1:644122614522:web:5c7f41285c1e1f58784743",
  measurementId: "G-LD41MRN5Z7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
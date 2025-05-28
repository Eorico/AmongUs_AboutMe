// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyB966LQtDSGb2LnZ_jMHFMYsHfwjRviU18",
  authDomain: "websiteaddimage.firebaseapp.com",
  projectId: "websiteaddimage",
  storageBucket: "websiteaddimage.appspot.com",
  messagingSenderId: "644122614522",
  appId: "1:644122614522:web:5c7f41285c1e1f58784743",
  measurementId: "G-LD41MRN5Z7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

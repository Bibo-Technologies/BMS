import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-storage.js";
import { getDatabase, ref, remove, push, get, update, onValue, child, set } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
 const firebaseConfig = {
    apiKey: "AIzaSyCi_hufIZTzsYtdPGQtvtmKmAkkrydmn_A",
  authDomain: "abbah-83a7b.firebaseapp.com",
  databaseURL: "https://abbah-83a7b-default-rtdb.firebaseio.com",
  projectId: "abbah-83a7b",
  storageBucket: "abbah-83a7b.appspot.com",
  messagingSenderId: "379729759051",
  appId: "1:379729759051:web:e75528d61b02d1e4f536ce",
  measurementId: "G-H41J2WMR6S"
  };

  const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);
const loginForm = document.getElementById('loginForm');


let authToken; // Declare authToken in the global scope

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    // Firebase Authentication Sign-in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Generate a token with a 1-minute validity
    authToken = Math.random().toString(36).substring(2);
    const currentTime = new Date();
    const tokenExpiryTime = new Date(currentTime.getTime() + 60 * 1000); // Token valid for 1 minute

    // Store token and expiry time in local storage
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('tokenExpiryTime', tokenExpiryTime.toString());

    console.log('Generated Token:', authToken);

    // Redirect after successful sign-in
    window.location.href = 'index.html';
  } catch (error) {
    // Handle login errors, e.g., incorrect credentials
    console.error("Login error", error);
  }
});

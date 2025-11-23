import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtIQZqjugOwZ4qQhdFnGEkwRMU68mIvYw",
  authDomain: "blogapp-2b70c.firebaseapp.com",
  projectId: "blogapp-2b70c",
  storageBucket: "blogapp-2b70c.firebasestorage.app",
  messagingSenderId: "301537417881",
  appId: "1:301537417881:web:78eed1b66a71780e0d3608",
  measurementId: "G-JNFGZ29GWG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, analytics, googleProvider };

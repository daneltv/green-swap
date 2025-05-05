import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
apiKey: "AIzaSyCqX4H94bCz7a1YcrwSuKMw26Ekh0Eh9dk",
authDomain: "green-management-c6990.firebaseapp.com",
projectId: "green-management-c6990",
storageBucket: "green-management-c6990.firebasestorage.app",
messagingSenderId: "887029821453",
appId: "1:887029821453:web:56675b15b0d92479892544",
measurementId: "G-PJEWBW7J39"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, collection, getDocs, addDoc, serverTimestamp, auth };
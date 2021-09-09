import firebase from 'firebase/compat/app';

import 'firebase/compat/analytics';
// Dùng để xác thực 
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDwrvlaLmGHHOW0qOSL8zv6gMuEJl0Sr9g",
    authDomain: "chat-app-2a0c3.firebaseapp.com",
    projectId: "chat-app-2a0c3",
    storageBucket: "chat-app-2a0c3.appspot.com",
    messagingSenderId: "1056375970822",
    appId: "1:1056375970822:web:5749004b9b82af4d443787",
    measurementId: "G-6J3RKEHRJS"
  };
// Khởi tạo firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
// Tạo db
const db = firebase.firestore();

auth.useEmulator('http://localhost:9099');
if (window.location.hostname === 'localhost'){
    db.useEmulator('localhost', '8080');
}

export {auth, db};
export default firebase;


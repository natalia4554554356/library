import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCa7D4i0-g9OQvsOHDefAlhcBl0neUZ2sY",
    authDomain: "e-library-aace8.firebaseapp.com",
    projectId: "e-library-aace8",
    storageBucket: "e-library-aace8.appspot.com",
    messagingSenderId: "535323215968",
    appId: "1:535323215968:web:8273a7055ab0922a5adb05"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

function signUp(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User registered:", user.email);
        })
        .catch((error) => {
            console.error("Sign up error:", error);
        });
}

const form = document.getElementById('auth-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const re_password = document.getElementById('re_password').value;

    if (password === re_password)
        signUp(email, password);
    else
        alert('Passwords are not equal')
})
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, updateProfile} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import {getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCa7D4i0-g9OQvsOHDefAlhcBl0neUZ2sY",
    authDomain: "e-library-aace8.firebaseapp.com",
    projectId: "e-library-aace8",
    storageBucket: "e-library-aace8.appspot.com",
    messagingSenderId: "535323215968",
    appId: "1:535323215968:web:8273a7055ab0922a5adb05"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);

function signUp(email, password, user_name) {
    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            updateProfile(auth.currentUser, {
                displayName: user_name,
            })

            setDoc(doc(db, 'users', auth.currentUser.uid), {});

            showPopup(popup_successful).then(() => {
                location = '/';
            })

        })
        .catch(() => {
            showPopup(popup_rejected)
        });
}

function showPopup(popup) {
    popup_overlay.classList.remove("hidden");
    popup.classList.remove("hidden");
    return new Promise((resolve) => {
        setTimeout(() => {
            popup.classList.add("hidden");
            popup_overlay.classList.add("hidden");
            resolve();
        }, 2000);
    })

}

async function fillHeader() {
    const querySnapshot = await getDocs(collection(db, 'nav_items'));
    const nav_items = {}
    querySnapshot.forEach(doc => nav_items[`${doc.id}`] = doc.data())

    const items = nav_items['auth_page'];
    nav_list.innerHTML += '\n' + items['home'];
    nav_list.innerHTML += '\n' + items['about_us'];
}

const form = document.getElementById('auth-form');
const nav_list = document.getElementById('nav_list');

const popup_rejected = document.getElementById('rejected-popup');
const popup_successful = document.getElementById('success-popup');
const popup_overlay = document.getElementById('popup_overlay');


fillHeader();

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const re_password = document.getElementById('re_password').value;
    const user_name = document.getElementById('user_name').value;

    if (password === re_password)
        signUp(email, password, user_name);
    else
        alert('Passwords are not equal')
})


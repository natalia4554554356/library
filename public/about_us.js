import {initializeApp} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    setDoc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import {getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

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

onAuthStateChanged(auth, (user) => {
    fillHeader(user);

})

async function fillHeader(user) {
    const querySnapshot = await getDocs(collection(db, 'nav_items'));
    const nav_items = {}
    querySnapshot.forEach(doc => nav_items[`${doc.id}`] = doc.data())

    nav_list.innerHTML = '';

    if (user) {
        const items = nav_items['about_logged_in'];
        nav_list.innerHTML += '\n' + items['home'];
        nav_list.innerHTML += '\n' + items['account'];
    } else {
        const items = nav_items['about_logged_out'];
        nav_list.innerHTML += '\n' + items['home'];
        nav_list.innerHTML += '\n' + items['sign_in'];
    }
}

const nav_list = document.getElementById('nav_list');
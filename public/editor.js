import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

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

const storage = getStorage(app);

const auth = getAuth(app);
let user;

window.onload = () => {
    onAuthStateChanged(auth, () => {
        user = auth.currentUser;
    })
}

const form = document.getElementById("book_create_form");

fillHeader();


form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("book_title").value;
    const author = document.getElementById("book_author").value;
    const type = document.getElementById("book_type").value;
    const pages = parseInt(document.getElementById("book_pages").value);
    const year = parseInt(document.getElementById("book_year").value);
    const isbn = document.getElementById("book_isbn").value;
    const imageFile = document.getElementById("book_image_upload_input").files[0];

    const imageName = Date.now() + "_" + imageFile.name;
    const imageRef = ref(storage, imageName);
    await uploadBytes(imageRef, imageFile);

    const imageUrl = await getDownloadURL(imageRef);
    const date = (new Date()).toString().split('(')[0];
    const bookData = {
        title,
        author,
        type,
        pages,
        year,
        isbn,
        imageUrl,
        createdAt: date,
        updatedAt: date,
        userID: user.uid,
    };
    addDoc(collection(db, "books"), bookData).then(() => {
        location = '/';
    });

});

async function fillHeader() {
    const querySnapshot = await getDocs(collection(db, 'nav_items'));
    const nav_items = {}
    querySnapshot.forEach(doc => nav_items[`${doc.id}`] = doc.data())

    nav_list.innerHTML = '';

    const items = nav_items['editor'];
    nav_list.innerHTML += '\n' + items['home'];
    nav_list.innerHTML += '\n' + items['account'];
    nav_list.innerHTML += '\n' + items['about_us'];
}

const nav_list = document.getElementById('nav_list');

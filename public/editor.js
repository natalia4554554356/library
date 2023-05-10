import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, collection, addDoc} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";

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

const form = document.getElementById("book-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("book-title").value;
    const author = document.getElementById("book-author").value;
    const type = document.getElementById("book-type").value;
    const pages = parseInt(document.getElementById("book-pages").value);
    const year = parseInt(document.getElementById("book-year").value);
    const isbn = document.getElementById("book-isbn").value;
    const imageFile = document.getElementById("book-image").files[0];

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
    };
    await addDoc(collection(db, "books"), bookData);

    form.reset();
});


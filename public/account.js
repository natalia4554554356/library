import {initializeApp} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import {getFirestore, collection, getDocs, getDoc, doc, deleteDoc, setDoc} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

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
let currentUser;

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    fetchLikedBooks();
    fetchCreatedBooks();

    if (likedBookContainer.innerHTML === '') {
        likedBookContainer.innerHTML = '<h1 class="no_liked_title">Looks like you have not liked books yet.</h1>'
    }

    if (createdBookContainer.innerHTML === '') {
        createdBookContainer.innerHTML = '<h1 class="no_created_title">Looks like you have not created books yet.</h1>'
    }

})

fillHeader();


async function fetchLikedBooks() {
    const querySnapshot = await getDocs(collection(db, `users_liked/${currentUser.uid}/posts`));

    querySnapshot.forEach(async (doc) => {
        const book = {...doc.data(), id: doc.id};
        const bookCard = await createLikedBookCard(book);
        likedBookContainer.appendChild(bookCard);
    });
}

async function createLikedBookCard(book) {
    const card = document.createElement('div');
    card.classList.add('book_card');

    const textContainer = document.createElement('div');
    textContainer.classList.add('book_card_text_container')

    const title = document.createElement('h1');
    title.classList.add('book_card_title')
    title.textContent = book.title.substring(0, 20);

    const author = document.createElement('p');
    author.classList.add('book_card_author')
    author.innerHTML = `<b>Author(s):</b>${book.author}`;

    const type = document.createElement('p');
    type.classList.add('book_card_type')
    type.innerHTML = `<b>Type:</b> ${book.type}`;

    const pages = document.createElement('p');
    pages.classList.add('book_card_pages')
    pages.innerHTML = `<b>Pages:</b> ${book.pages}`;

    const year = document.createElement('p');
    year.classList.add('book_card_year')
    year.innerHTML = `<b>Year of Publication</b>: ${book.year}`;

    const isbn = document.createElement('p');
    isbn.classList.add('book_card_isbn')
    isbn.innerHTML = `<b>ISBN:</b> ${book.isbn}`;

    const timeInfo = document.createElement('div');
    timeInfo.classList.add('book_card_time_info')

    const createdAt = document.createElement('p');
    const updatedAt = document.createElement('p');
    createdAt.classList.add('book_card_time_info_createdAt');
    updatedAt.classList.add('book_card_time_info_updatedAt');
    createdAt.innerHTML = `<small>Created at: ${book.createdAt}</small>`
    updatedAt.innerHTML = `<small>Updated at: ${book.updatedAt}</small>`

    timeInfo.append(createdAt, updatedAt)


    const image = document.createElement('img');
    image.classList.add('book_card_image')
    image.src = book.imageUrl;
    image.alt = book.title;

    const controls_container = document.createElement('div');
    controls_container.classList.add('controls_container');

    const like_button = document.createElement('i');

    like_button.classList.add('fa-solid');
    like_button.classList.add('fa-heart');

    const docSnap = await getDoc(doc(db, `users_liked/${currentUser.uid}/posts/`, `${book.id}`));

    if (docSnap.exists()) {
        like_button.classList.add('checked');
    }

    like_button.addEventListener('click', (e) => {
        if (e.target.classList.contains('checked')) {
            deleteDoc(doc(db, `users_liked/${currentUser.uid}/posts/`, `${book.id}`));
        } else {
            setDoc(doc(db, `users_liked/${currentUser.uid}/posts/`, `${book.id}`), book);
        }

        e.target.classList.toggle('checked');
    })

    controls_container.appendChild(like_button);
    card.appendChild(image);
    textContainer.appendChild(title);
    textContainer.appendChild(author);
    textContainer.appendChild(type);
    textContainer.appendChild(pages);
    textContainer.appendChild(year);
    textContainer.appendChild(isbn);
    textContainer.appendChild(timeInfo);
    card.appendChild(textContainer);
    card.appendChild(controls_container);

    return card;
}


async function fetchCreatedBooks() {
    const querySnapshot = await getDocs(collection(db, `books`));

    querySnapshot.forEach(async (doc) => {
        const book = {...doc.data(), id: doc.id};

        if (book.userID === currentUser.uid) {
            const bookCard = await createCreatedBookCard(book);
            createdBookContainer.appendChild(bookCard);
        }
    });
}

async function createCreatedBookCard(book) {
    const card = document.createElement('div');
    card.classList.add('book_card');

    const textContainer = document.createElement('div');
    textContainer.classList.add('book_card_text_container')

    const title = document.createElement('h1');
    title.classList.add('book_card_title')
    title.textContent = book.title.substring(0, 20);

    const author = document.createElement('p');
    author.classList.add('book_card_author')
    author.innerHTML = `<b>Author(s):</b>${book.author}`;

    const type = document.createElement('p');
    type.classList.add('book_card_type')
    type.innerHTML = `<b>Type:</b> ${book.type}`;

    const pages = document.createElement('p');
    pages.classList.add('book_card_pages')
    pages.innerHTML = `<b>Pages:</b> ${book.pages}`;

    const year = document.createElement('p');
    year.classList.add('book_card_year')
    year.innerHTML = `<b>Year of Publication</b>: ${book.year}`;

    const isbn = document.createElement('p');
    isbn.classList.add('book_card_isbn')
    isbn.innerHTML = `<b>ISBN:</b> ${book.isbn}`;

    const timeInfo = document.createElement('div');
    timeInfo.classList.add('book_card_time_info')

    const createdAt = document.createElement('p');
    const updatedAt = document.createElement('p');
    createdAt.classList.add('book_card_time_info_createdAt');
    updatedAt.classList.add('book_card_time_info_updatedAt');
    createdAt.innerHTML = `<small>Created at: ${book.createdAt}</small>`
    updatedAt.innerHTML = `<small>Updated at: ${book.updatedAt}</small>`

    timeInfo.append(createdAt, updatedAt)


    const image = document.createElement('img');
    image.classList.add('book_card_image')
    image.src = book.imageUrl;
    image.alt = book.title;

    const controls_container = document.createElement('div');
    controls_container.classList.add('controls_container');

    const like_button = document.createElement('i');

    like_button.classList.add('fa-solid');
    like_button.classList.add('fa-heart');

    const docSnap = await getDoc(doc(db, `users_liked/${currentUser.uid}/posts/`, `${book.id}`));

    if (docSnap.exists()) {
        like_button.classList.add('checked');
    }

    like_button.addEventListener('click', (e) => {
        if (e.target.classList.contains('checked')) {
            deleteDoc(doc(db, `users_liked/${currentUser.uid}/posts/`, `${book.id}`));
        } else {
            setDoc(doc(db, `users_liked/${currentUser.uid}/posts/`, `${book.id}`), book);
        }

        e.target.classList.toggle('checked');
    })

    controls_container.appendChild(like_button);
    card.appendChild(image);
    textContainer.appendChild(title);
    textContainer.appendChild(author);
    textContainer.appendChild(type);
    textContainer.appendChild(pages);
    textContainer.appendChild(year);
    textContainer.appendChild(isbn);
    textContainer.appendChild(timeInfo);
    card.appendChild(textContainer);
    card.appendChild(controls_container);

    return card;
}

async function fillHeader() {
    const querySnapshot = await getDocs(collection(db, 'nav_items'));
    const nav_items = {}
    querySnapshot.forEach(doc => nav_items[`${doc.id}`] = doc.data())

    nav_list.innerHTML = '';

    const items = nav_items['account'];
    nav_list.innerHTML += '\n' + items['home'];
    nav_list.innerHTML += '\n' + `<h1 class="header_title">Hello ${currentUser.displayName}!`;
    nav_list.innerHTML += '\n' + items['about_us'];
}

const likedBookContainer = document.getElementById('liked_books_container');
const createdBookContainer = document.getElementById('created_books_container');
const nav_list = document.getElementById('nav_list');


const log_out_btn = document.querySelector('.log_out_button');

log_out_btn.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            location = '/sign_in';
        }
    )
})

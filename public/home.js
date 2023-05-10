import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, collection, getDocs} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

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

const bookContainer = document.getElementById('books_container');

function createBookCard(book) {
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

    card.appendChild(image);
    textContainer.appendChild(title);
    textContainer.appendChild(author);
    textContainer.appendChild(type);
    textContainer.appendChild(pages);
    textContainer.appendChild(year);
    textContainer.appendChild(isbn);
    textContainer.appendChild(timeInfo);
    card.appendChild(textContainer)

    return card;
}

async function fetchBooks() {
    const querySnapshot = await getDocs(collection(db, 'books'));

    querySnapshot.forEach((doc) => {
        const book = doc.data();
        const bookCard = createBookCard(book);
        bookContainer.appendChild(bookCard);
    });
}

fetchBooks();
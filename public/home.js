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

console.log(bookContainer)

function createBookCard(book) {
    const card = document.createElement('div');
    card.classList.add('book_card');

    const title = document.createElement('h3');
    title.classList.add('book_card_title')

    title.textContent = book.title;

    const author = document.createElement('p');
    author.classList.add('book_card_author')
    author.textContent = `Author(s): ${book.author}`;

    const type = document.createElement('p');
    type.classList.add('book_card_type')
    type.textContent = `Type: ${book.type}`;

    const pages = document.createElement('p');
    pages.classList.add('book_card_pages')
    pages.textContent = `Pages: ${book.pages}`;

    const year = document.createElement('p');
    year.classList.add('book_card_year')
    year.textContent = `Year of Publication: ${book.year}`;

    const isbn = document.createElement('p');
    isbn.classList.add('book_card_isbn')
    isbn.textContent = `ISBN: ${book.isbn}`;

    const image = document.createElement('img');
    image.classList.add('book_card_image')
    image.src = book.imageUrl;
    image.alt = book.title;

    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(type);
    card.appendChild(pages);
    card.appendChild(year);
    card.appendChild(isbn);

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
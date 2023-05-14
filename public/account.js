import {initializeApp} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    doc,
    deleteDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

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
let buttons = [];
let created_posts = [];

onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    await fetchLikedBooks();
    await fetchCreatedBooks();

    if (likedBookContainer.innerHTML === '') {
        likedBookContainer.innerHTML = '<h1 class="no_liked_title">Looks like you have not liked books yet.</h1>'
    }

    if (createdBookContainer.innerHTML === '') {
        createdBookContainer.innerHTML = '<h1 class="no_created_title">Looks like you have not created books yet.</h1>'
    }

    buttons = Array.from(document.querySelectorAll('.edit_button'));
    created_posts = Array.from(document.querySelectorAll('.book_card'));
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

function handleEdit(e) {
    const postToEdit = created_posts[buttons.indexOf(e.target)];

    const elementsToHide = ['.book_card_title_value',
        '.book_card_author_value',
        '.book_card_type_value',
        '.book_card_pages_value',
        '.book_card_year_value',
        '.book_card_isbn_value'].map(className => postToEdit.querySelector(className));

    elementsToHide.forEach(element => {
        element.classList.add('hidden');
    })

    const elementsToShow = ['.title_edit_input',
        '.author_edit_input',
        '.type_edit_input',
        '.pages_edit_input',
        '.year_edit_input',
        '.isbn_edit_input'].map(className => postToEdit.querySelector(className));

    elementsToShow.forEach(element => {
        element.classList.remove('hidden');
    })

    for (let i = 0; i < elementsToHide.length; i++) {
        elementsToShow[i].value = elementsToHide[i].innerText;
    }

    e.target.classList.add('hidden')
    const submit_btn = document.querySelector('.edit_submit_button');
    submit_btn.classList.remove('hidden');
}

function handleEditSubmit(e) {

    const inputData = ['.title_edit_input',
        '.author_edit_input',
        '.type_edit_input',
        '.pages_edit_input',
        '.year_edit_input',
        '.isbn_edit_input'].map(inputName => {
        const input = document.querySelector(inputName);
        return input.value;
    });

    const data = {};
    const keys = ['title',
        'author',
        'type',
        'pages',
        'year',
        'isbn']

    for (let i = 0; i < keys.length; i++) {
        data[keys[i]] = inputData[i];
    }
    data['updatedAt'] = (new Date()).toString().split('(')[0];
    const cardId = e.target.value;

    setDoc(doc(db, 'books', cardId), data, {merge: true})
        .then(() => {
            location = '/account';
        });
}

async function deletePost(e) {
    const cardId = e.target.value;
    deleteDoc(doc(db, 'books', cardId)).then(() => {
            getDocs(collection(db, 'users')).then(users => {
                users.forEach(user => {
                    deleteDoc(doc(db, `users_liked/${user.id}/posts`, cardId)).catch(() => {
                    })
                })

                location = '/account';
            })
        }
    );

}

async function createCreatedBookCard(book) {
    const card = document.createElement('div');
    card.classList.add('book_card');

    const textContainer = document.createElement('div');
    textContainer.classList.add('book_card_text_container');

    const title = document.createElement('h1');
    title.classList.add('book_card_title_value')
    title.innerText = `${book.title}`

    const title_edit_input = document.createElement('input');
    title_edit_input.classList.add('title_edit_input');
    title_edit_input.classList.add('edit_input');
    title_edit_input.classList.add('hidden');

    const author = document.createElement('p');
    author.classList.add('book_card_author')
    author.innerHTML = `<b>Author(s):</b> `;

    const author_value = document.createElement('p');
    author_value.classList.add('book_card_author_value')
    author_value.textContent = `${book.author}`;

    const author_edit_input = document.createElement('input');
    author_edit_input.classList.add('author_edit_input');
    author_edit_input.classList.add('edit_input');
    author_edit_input.classList.add('hidden');

    const type = document.createElement('p');
    type.classList.add('book_card_type')
    type.innerHTML = `<b>Type:</b> `;

    const type_value = document.createElement('p');
    type_value.classList.add('book_card_type_value')
    type_value.textContent = `${book.type}`;

    const type_edit_input = document.createElement('input');
    type_edit_input.classList.add('type_edit_input');
    type_edit_input.classList.add('edit_input');
    type_edit_input.classList.add('hidden');

    const pages = document.createElement('p');
    pages.classList.add('book_card_pages')
    pages.innerHTML = `<b>Pages:</b> `;

    const pages_value = document.createElement('p');
    pages_value.classList.add('book_card_pages_value')
    pages_value.textContent = `${book.pages}`;

    const pages_edit_input = document.createElement('input');
    pages_edit_input.classList.add('pages_edit_input');
    pages_edit_input.classList.add('edit_input');
    pages_edit_input.classList.add('hidden');

    const year = document.createElement('p');
    year.classList.add('book_card_year')
    year.innerHTML = `<b>Year of Publication</b>: `;

    const year_value = document.createElement('p');
    year_value.classList.add('book_card_year_value')
    year_value.textContent = `${book.year}`;

    const year_edit_input = document.createElement('input');
    year_edit_input.classList.add('year_edit_input');
    year_edit_input.classList.add('edit_input');
    year_edit_input.classList.add('hidden');

    const isbn = document.createElement('p');
    isbn.classList.add('book_card_isbn')
    isbn.innerHTML = `<b>ISBN:</b> `;

    const isbn_value = document.createElement('p');
    isbn_value.classList.add('book_card_isbn_value')
    isbn_value.textContent = `${book.isbn}`;

    const isbn_edit_input = document.createElement('input');
    isbn_edit_input.classList.add('isbn_edit_input');
    isbn_edit_input.classList.add('edit_input');
    isbn_edit_input.classList.add('hidden');

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

    const edit_button = document.createElement('i');
    edit_button.classList.add('fa-solid');
    edit_button.classList.add('fa-pen-to-square');
    edit_button.addEventListener('click', (e) => {
        handleEdit(e);
    });
    edit_button.classList.add('edit_button');

    const edit_submit_button = document.createElement('i');
    edit_submit_button.addEventListener('click', (e) => {
        handleEditSubmit(e);
    });
    edit_submit_button.classList.add('edit_submit_button');
    edit_submit_button.classList.add('hidden');
    edit_submit_button.classList.add('fa-solid');
    edit_submit_button.classList.add('fa-check');
    edit_submit_button.value = book.id;

    const delete_button = document.createElement('i');
    delete_button.addEventListener('click', (e) => {
        deletePost(e);
    });
    delete_button.classList.add('delete_post_button');
    delete_button.classList.add('fa-solid');
    delete_button.classList.add('fa-trash');
    delete_button.value = book.id;

    controls_container.appendChild(edit_button);
    controls_container.appendChild(edit_submit_button);
    controls_container.appendChild(delete_button);
    card.appendChild(image);
    textContainer.appendChild(title);
    textContainer.appendChild(title_edit_input);
    textContainer.appendChild(author);
    textContainer.appendChild(author_value);
    textContainer.appendChild(author_edit_input);
    textContainer.appendChild(type);
    textContainer.appendChild(type_value);
    textContainer.appendChild(type_edit_input);
    textContainer.appendChild(pages);
    textContainer.appendChild(pages_value);
    textContainer.appendChild(pages_edit_input);
    textContainer.appendChild(year);
    textContainer.appendChild(year_value);
    textContainer.appendChild(year_edit_input);
    textContainer.appendChild(isbn);
    textContainer.appendChild(isbn_value);
    textContainer.appendChild(isbn_edit_input);
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

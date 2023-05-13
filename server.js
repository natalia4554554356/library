const express = require('express')

const path = require('path')

const initial_path = path.join(__dirname, '/public')

const app = express();
app.use(express.static(initial_path));

app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, 'index.html'))
})

app.get('/about', (req, res) => {
    res.sendFile(path.join(initial_path, 'about.html'))
})

app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path, 'editor.html'))
})

app.get('/sign_in', (req, res) => {
    res.sendFile(path.join(initial_path, 'sign_in.html'))
})

app.get('/sign_up', (req, res) => {
    res.sendFile(path.join(initial_path, 'sign_up.html'))
})

app.get('/account', (req, res) => {
    res.sendFile(path.join(initial_path, 'account.html'))
})

app.listen('3000', () => {
    console.log('Listnening on 3000')
});
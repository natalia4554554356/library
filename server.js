const express = require('express')

const path = require('path')

const initial_path = path.join(__dirname, '/public')

const app = express();
app.use(express.static(initial_path));

app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, 'index.html'))
})

app.get('/about', (req, res) => {
    console.log(initial_path + '/pages')
    res.sendFile(path.join(initial_path + '/pages', 'about.html'))
})

app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path + '/pages', 'editor.html'))
})

app.get('/sign_in', (req, res) => {
    res.sendFile(path.join(initial_path + '/pages', 'sign_in.html'))
})

app.get('/sign_up', (req, res) => {
    res.sendFile(path.join(initial_path + '/pages', 'sign_up.html'))
})

app.get('/account', (req, res) => {
    res.sendFile(path.join(initial_path + '/pages', 'account.html'))
})

app.listen('3000', () => {
    console.log('Listnening on 3000')
});
const express = require('express')
const chats = require('./data/data')
const dotenv = require('dotenv')

const app = express()
dotenv.config();
//app.use(cors({credentials: true, origin: 'http://127.0.0.1:3000'}))

app.get('/', (req, res) => {
    res.send("APi is running");
})

app.get('/chat', (req, res) => {
    res.send(chats);
})

app.get('/chat/:id', (req, res) => {
    const singleChat = chats.find(c => c._id === req.params.id)
    res.send(singleChat);
})

const PORT = process.env.PORT;

app.listen(PORT, console.log("Server has started"))
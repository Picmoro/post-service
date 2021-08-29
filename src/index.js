const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
require('colors');

const app =  express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
})

app.post('/posts', async (req, res) => {
    console.log("\nCreating new post".bgYellow.black);
    const id = randomBytes(4).toString('hex');
    console.log(`Id: ${id}`.bgYellow.black);
    const {title} = req.body;
    posts[id] = {
        id, title
    }
    console.log(`Created: ${JSON.stringify(posts)}`.bgYellow.black);
    try {
        await axios.post("http://localhost:4005/events", {
            type: "PostCreated",
            data: {
                id, title
            }
        })
    }catch (e) {
        console.error(`${e.message}`.bgRed.black);
    }
    console.log(`Echo event: type: "PostCreated" data: ${JSON.stringify(posts)}`.bgYellow.black);
    res.status(201).send(posts[id]);
})

app.listen(4000, () => {
    console.info('\n' +
        '██████   ██████  ███████ ████████       ███████ ███████ ██████  ██    ██ ██  ██████ ███████ \n' +
        '██   ██ ██    ██ ██         ██          ██      ██      ██   ██ ██    ██ ██ ██      ██      \n' +
        '██████  ██    ██ ███████    ██    █████ ███████ █████   ██████  ██    ██ ██ ██      █████   \n' +
        '██      ██    ██      ██    ██               ██ ██      ██   ██  ██  ██  ██ ██      ██      \n' +
        '██       ██████  ███████    ██          ███████ ███████ ██   ██   ████   ██  ██████ ███████ \n' +
        '                                                                                            \n' +
        '                                                                                            \n');
    console.info('Listening on 4000'.bgGreen.black);
})
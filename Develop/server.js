const express = require('express');
const fs = require('fs');
const path = require('path');

const uniqid = require('uniqid'); 

const PORT = process.env.PORT || 3001;


const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res) => {

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        res.send(data);
      });
});

app.post('/api/notes', (req, res) => {

    const userNote = req.body;
    userNote.id = uniqid();

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        const notesList = JSON.parse(data);
        notesList.push(userNote);

        fs.writeFile('./db/db.json', JSON.stringify(notesList), (err) => {if (err) throw err});
    });

    res.json(req.body);
});

app.delete('/api/notes/:id', (req, res) => {

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        const notesList = JSON.parse(data);

        for (let i = 0; i < notesList.length; i++) {

            if (notesList[i].id == req.params.id) {
                notesList.splice(i, 1);
            }
        }

        fs.writeFile('./db/db.json', JSON.stringify(notesList), (err) => {if (err) throw err});
    });

    res.json(req.body);
});

app.listen(PORT, () => console.log(`Server Listening at http://localhost:${PORT}`));


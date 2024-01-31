const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const uuid = require('./helper/uuid');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
});

// GET request for notes
app.get('/api/notes', async (req, res) => {
  const notes = await fs.readFile('./db/db.json', 'utf-8');
  res.status(200).json(JSON.parse(notes));
});

// // Route for notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// POST request to add a note
app.post('/api/notes', async (req, res) => {
  console.info(`${req.method} request received to add a note`);
  const { title, text } = req.body;
  const newNote = {
    "title": title,
    "text": text,
    "id": uuid()
  }

  try {
    const rawNotes = await fs.readFile('./db/db.json', 'utf-8');
    const notes = JSON.parse(rawNotes);
    notes.push(newNote);

    await fs.writeFile('./db/db.json', JSON.stringify(notes));
    res.json(notes);
  } catch (err) {
    console.error(err)
  }

});

app.delete('/api/notes/:id', async (req, res) => {
  console.info(`${req.method} request received to delete a note`);

  try {
    const rawNotes = await fs.readFile('./db/db.json', 'utf-8');
    const notes = JSON.parse(rawNotes);

    const noteId = req.params.id;
    const updatedNotes = notes.filter((note) => note.id !== noteId);

    await fs.writeFile('./db/db.json', JSON.stringify(updatedNotes));
    res.json(updatedNotes);
  } catch (err) {
    console.error(err);
  }
});


app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
});


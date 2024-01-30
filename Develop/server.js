const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET request for notes
app.get('/', (req, res) => {
  // Read notes from the file and send them as a response
  fs.readFile('./db/notes.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json(`${req.method} Error reading notes`);
    } else {
      const parsedNotes = JSON.parse(data);
      res.status(200).json(`${req.method} parsedNotes`);
    }
  });
});

// Route for notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// POST request to add a note
      app.post('/notes', (req, res) => {
        console.info(`${req.method} request received to add a note`);
      
        const { title, text } = req.body;
      
        if (!title || !text) {
          res.status(400).json('Bad request. Title and text are required');
          return;
        }
      
        const newNote = {
          title,
          text,
          id: uuid(),
        };

    fs.readFile('./db/notes.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json('Error reading notes');
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);

        fs.writeFile(
          './db/notes.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) => {
            if (writeErr) {
              console.error(writeErr);
              res.status(500).json('Error writing notes');
            } else {
              console.info('Successfully updated notes!');
              res.status(201).json(newNote);
            }
          }
        );
      }
    });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);


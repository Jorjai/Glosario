const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the main directory (including HTML, CSS, and JS)
app.use(express.static(path.join(__dirname, '../')));

// Load words from words.json
function loadWords() {
    const data = fs.readFileSync(path.join(__dirname, '../data/words.json'));
    return JSON.parse(data);
}

// Save words to words.json
function saveWords(words) {
    fs.writeFileSync(path.join(__dirname, '../data/words.json'), JSON.stringify(words, null, 2));
}

// Add a new route to handle the root request
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html')); // Serve your main HTML file
});

// GET all words
app.get('/words', (req, res) => {
    console.log('GET /words endpoint called');
    const words = loadWords();
    res.json(words);
});

// POST add a new word
app.post('/words', (req, res) => {
    const newWord = req.body;
    const words = loadWords();

    const index = words.findIndex((word) => word.word === newWord.word);
    if (index >= 0) {
        return res.status(400).send('Word already exists! Use the update functionality to modify it.');
    } else {
        words.push(newWord); // Add new word
        saveWords(words);
        res.status(200).send('Word added successfully!');
    }
});

// PUT update an existing word
app.put('/words/:word', (req, res) => {
    const wordToUpdate = req.params.word;
    const updatedData = req.body;
    let words = loadWords();

    const index = words.findIndex((word) => word.word === wordToUpdate);
    if (index >= 0) {
        words[index] = updatedData; // Update existing word
        saveWords(words);
        res.status(200).send('Word updated successfully!');
    } else {
        res.status(404).send('Word not found!');
    }
});

// DELETE a word by its word property
app.delete('/words/:word', (req, res) => {
    const wordToDelete = req.params.word;
    let words = loadWords();

    words = words.filter((word) => word.word !== wordToDelete);
    saveWords(words);

    res.status(200).send('Word deleted successfully!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
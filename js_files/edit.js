"use strict";
// Backend URL
const backendUrl = 'https://glosario-uduz.onrender.com';

// Function to load words from the backend
async function loadWords() {
    try {
        const response = await fetch(`${backendUrl}/words`);
        if (!response.ok) {
            throw new Error('Failed to load words');
        }
        const words = await response.json();
        console.log('Fetched words:', words);
        displayWords(words);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to display words in the word list
function displayWords(words) {
    const wordList = document.getElementById('word-list');
    wordList.innerHTML = '';
    words.forEach((word) => {
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item-container';
        wordItem.innerHTML = `
            <div class="word-item">
                <h3>${word.word}</h3>
                <p>Significado: ${word.meaning}</p>
                <button onclick="showUpdateForm('${word.word}', '${word.meaning}', this)">Actualizar</button>
                <button onclick="deleteWord('${word.word}')">Borrar</button>
            </div>
        `;
        wordList.appendChild(wordItem);
    });
}

// Load words when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadWords();
});

// Function to add a word
async function addWord(wordData) {
    try {
        const response = await fetch(`${backendUrl}/words`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wordData),
        });
        if (!response.ok) {
            throw new Error('Failed to add word');
        }
        alert('Word added successfully!');
        loadWords(); // Refresh the word list automatically
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding word.');
    }
}

// Function to show update form for a word next to the selected item
function showUpdateForm(originalWord, originalMeaning, buttonElement) {
    // Remove any existing update forms before adding a new one
    const existingUpdateForm = document.getElementById('update-form');
    if (existingUpdateForm) {
        existingUpdateForm.remove();
    }

    const updateFormHtml = `
        <div id="update-form" class="update-form">
            <input type="text" id="update-word" value="${originalWord}" placeholder="Update word">
            <input type="text" id="update-meaning" value="${originalMeaning}" placeholder="Update meaning">
            <button onclick="submitUpdate('${originalWord}')">Actualizar</button>
            <button onclick="cancelUpdate()">Cancelar</button>
        </div>
    `;

    // Insert the form directly after the word item buttons
    const wordItem = buttonElement.parentElement;
    wordItem.insertAdjacentHTML('beforeend', updateFormHtml);
}

// Function to cancel update
function cancelUpdate() {
    const updateForm = document.getElementById('update-form');
    if (updateForm) {
        updateForm.remove();
    }
}

// Function to submit an update
async function submitUpdate(originalWord) {
    const newWord = document.getElementById('update-word').value;
    const newMeaning = document.getElementById('update-meaning').value;

    if (newWord && newMeaning) {
        try {
            const response = await fetch(`${backendUrl}/words/${originalWord}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word: newWord, meaning: newMeaning }),
            });
            if (!response.ok) {
                throw new Error('Hubo un error actualizando la palabra');
            }
            alert('La palabra ha sido actualizada!');
            loadWords(); // Refresh the word list automatically
            cancelUpdate(); // Remove the update form
        } catch (error) {
            console.error('Error Actualizando la palabra:', error);
            alert('Hubo un error actualizando la palabra');
        }
    }
}

// Handling form submission for adding words
document.getElementById('word-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const word = document.getElementById('word').value;
    const meaning = document.getElementById('meaning').value;
    addWord({ word, meaning });
});

// Function to delete a word
async function deleteWord(word) {
    try {
        const response = await fetch(`${backendUrl}/words/${word}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Hubo un fallo al borrar la palabra');
        }
        alert('La palabra ha sido borrada!');
        loadWords(); // Refresh the word list automatically
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error borrando la palabra.');
    }
}

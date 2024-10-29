"use strict";
document.addEventListener("DOMContentLoaded", () => {
    fetch('data/words.json')
        .then(response => response.json())
        .then(data => {
            const wordList = document.getElementById('word-list');
            wordList.innerHTML = '';

            data.forEach(entry => {
                const wordEntry = document.createElement('div');
                wordEntry.classList.add('word-entry');

                wordEntry.innerHTML = `
                    <h3>${entry.word}</h3>
                    <p><strong>Significado:</strong> ${entry.meaning}</p>
                `;

                wordList.appendChild(wordEntry);
            });
        });
});
// @ts-nocheck

const form = document.getElementById('chat-form');
const input = document.getElementById('user-message');
const output = document.getElementById('chat-output');
const API_KEY = process.env.API_KEY;

form.addEventListener('submit', async (event) => {
    console.log(input.value);
    event.preventDefault();
    const prompt = input.value;

    // Send the text to the API endpoint
    fetch('http://localhost:3000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: prompt || '' }),
    })
        .then((response) => response.json())
        .then(async (data) => {
            output.innerHTML += `<p>${prompt}</p><p>${data.reply}</p>`;
            input.value = '';
            output.innerHTML += `<p>User: ${prompt}</p><p>Chat: ${data}</p>`;
        })
        .catch((error) => {
            alert(
                "Error. Make sure you're running the server by following the instructions on https://github.com/gragland/chatgpt-chrome-extension. Also make sure you don't have an adblocker preventing requests to localhost:3000."
            );
            throw new Error(error);
        });
});

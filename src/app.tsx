import React, { useState } from 'react';
import './app.css';
import { WelcomeMessage } from './components/welcome-message';

function App() {
    const [message, setMessage] = useState('Hello! How can I help you today?');
    const [userInput, setUserInput] = useState('');

    return (
        <>
            <WelcomeMessage />
            <div className="container" id="chat-output">
                <div id="chat-message">
                    <p>{message}</p>
                </div>
            </div>

            <div className="container">
                <form id="chat-form">
                    <label htmlFor="user-message">Message: </label>
                    <input
                        type="text"
                        id="user-message"
                        name="user-message"
                        placeholder="Type your message here..."
                        value={userInput}
                        onChange={(event) => {
                            setUserInput(event.target.value);
                        }}
                    />
                    <br />
                    <button
                        onClick={(event) => {
                            event.preventDefault();
                            console.log('test', userInput);
                            // Send the text to the API endpoint
                            fetch('http://localhost:3000', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ message: userInput }),
                            })
                                .then((response) => response.json())
                                .then(async (data) => {
                                    console.log(data);
                                    setMessage(data.reply);
                                })
                                .catch((error) => {
                                    alert(
                                        "Error. Make sure you're running the server by following the instructions on https://github.com/gragland/chatgpt-chrome-extension. Also make sure you don't have an adblocker preventing requests to localhost:3000."
                                    );
                                    throw new Error(error);
                                });
                        }}
                    >
                        Send
                    </button>
                </form>
            </div>
        </>
    );
}

export default App;

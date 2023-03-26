import React, { useRef, useState } from 'react';
import './app.css';
import { WelcomeMessage } from './components/welcome-message';

function App() {
    const [messages, setMessages] = useState([
        'Hello! How can I help you today?',
    ]);
    const [previousInputs, setPreviousInputs] = useState<string[]>([]);
    const [userInput, setUserInput] = useState('');
    const parentMessageId = useRef();

    return (
        <>
            <WelcomeMessage />
            <div className="container" id="chat-output">
                <div id="chat-message">
                    {messages.map((msg, idx) => {
                        return (
                            <React.Fragment key={`conv-${idx}`}>
                                <p>Assistant: {msg}</p>
                                {idx < previousInputs.length && (
                                    <p>You: {previousInputs[idx]}</p>
                                )}
                            </React.Fragment>
                        );
                    })}
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
                            setPreviousInputs((previousInputs) => {
                                return [...previousInputs, userInput];
                            });
                            // Send the text to the API endpoint
                            fetch('http://localhost:3000', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    message: userInput,
                                    parentMessageId: parentMessageId.current,
                                }),
                            })
                                .then((response) => response.json())
                                .then(async (data) => {
                                    if (data.id) {
                                        parentMessageId.current = data.id;
                                    }
                                    setMessages((msg) => {
                                        return [...msg, data.reply];
                                    });
                                })
                                .catch((error) => {
                                    alert(
                                        "Error. Make sure you're running the server by using `npm run server`. Also make sure you don't have an adblocker preventing requests to localhost:3000."
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

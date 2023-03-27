import React, { useRef, useState } from 'react';
import './app.css';
import { WelcomeMessage } from './components/welcome-message';

function App() {
    const [messages, setMessages] = useState([
        "Hello! I'm here to help you write your user journeys. Please answer a few questions to get started.\n\n\n\nFirst of all, what type of client is the user journey for?",
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
                                <div className="d-flex flex-row justify-content-start mb-4">
                                    <img
                                        id="iconbot"
                                        className="col-md"
                                        src="iconbot.png"
                                    ></img>
                                    <div className="col-md assistant-message-wrapper">
                                        <p className="assistant-message">
                                            Assistant: {msg}
                                        </p>
                                    </div>
                                </div>
                                {idx < previousInputs.length && (
                                    <div className="user-message-wrapper">
                                        <div className="row">
                                            <p className="col-md user-message">
                                                You: {previousInputs[idx]}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            <div className="d-flex flex-row justify-content-start mb-4">
                <form className="col-md" id="chat-form">
                    <input
                        type="text"
                        id="user-message"
                        name="user-message"
                        placeholder="Type your message here..."
                        value={userInput}
                        onChange={(event) => {
                            setUserInput(event.target.value);
                        }}
                    ></input>
                    <button
                        id="send-btn"
                        className="col-md btn btn-info"
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
                        <img id="icon-send" src="iconsend.png"></img>
                    </button>
                </form>
            </div>
        </>
    );
}

export default App;

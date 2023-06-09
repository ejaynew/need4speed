import React, { useRef, useState } from 'react';
import './app.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { WelcomeMessage } from './components/welcome-message';

const choices = [
    'Consumer Products',
    'Financial Services',
    'Public Sector',
    'State and Local',
    'Transportation',
    'Energy',
    'Health',
    'Retail',
    'TMT',
    'Travel & Hospitality',
];

function App() {
    const [messages, setMessages] = useState([
        'Hey, Ka. Need some help writing your user journey? Please answer some questions to get started.',
        'What type of client is this user journey for?',
    ]);
    const [previousInputs, setPreviousInputs] = useState<string[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isFirstRun, setIsFirstRun] = useState(true);
    const parentMessageId = useRef();

    const sendMessage = (event: any) => {
        event.preventDefault();
        setUserInput('');
        console.log('input:', userInput);
        setPreviousInputs((previousInputs) => {
            return [...previousInputs, userInput];
        });
        // Send the text to the API endpoint
        fetch('https://localhost:3000', {
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
    };

    return (
        <>
            <WelcomeMessage />
            <hr />
            <div className="container" id="chat-output">
                <div id="chat-message">
                    {messages.map((msg, idx) => {
                        return (
                            <React.Fragment key={`conv-${idx}`}>
                                <div className="d-flex flex-row justify-content-start">
                                    <img
                                        id="iconbot"
                                        className="col-md"
                                        src="iconbot.png"
                                        style={{
                                            height: '45px',
                                            width: '45px',
                                            maxWidth: '45px',
                                            padding: '0',
                                        }}
                                        alt="iconbot"
                                    />
                                    <div className="col-md assistant-message-wrapper">
                                        <p className="assistant-message">
                                            {msg}
                                        </p>
                                    </div>
                                </div>
                                {idx === 1 && (
                                    <div className="choices-grid">
                                        {choices.map((vertical) => {
                                            return (
                                                <Button
                                                    disabled={!isFirstRun}
                                                    variant="outline-dark"
                                                    className="choices-button"
                                                    onClick={() => {
                                                        fetch(
                                                            'https://localhost:3000',
                                                            {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type':
                                                                        'application/json',
                                                                },
                                                                body: JSON.stringify(
                                                                    {
                                                                        message: `The client for this user journey is ${vertical}`,
                                                                        parentMessageId:
                                                                            parentMessageId.current,
                                                                    }
                                                                ),
                                                            }
                                                        )
                                                            .then((response) =>
                                                                response.json()
                                                            )
                                                            .then(
                                                                async (
                                                                    data
                                                                ) => {
                                                                    if (
                                                                        data.id
                                                                    ) {
                                                                        parentMessageId.current =
                                                                            data.id;
                                                                    }
                                                                    setMessages(
                                                                        (
                                                                            msg
                                                                        ) => {
                                                                            return [
                                                                                ...msg,
                                                                                data.reply,
                                                                            ];
                                                                        }
                                                                    );
                                                                    setIsFirstRun(
                                                                        false
                                                                    );
                                                                }
                                                            )
                                                            .catch((error) => {
                                                                alert(
                                                                    "Error. Make sure you're running the server by using `npm run server`. Also make sure you don't have an adblocker preventing requests to localhost:3000."
                                                                );
                                                                throw new Error(
                                                                    error
                                                                );
                                                            });
                                                    }}
                                                >
                                                    {vertical}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                )}
                                {idx - 2 >= 0 &&
                                    idx - 2 < previousInputs.length && (
                                        <div className="user-message-wrapper">
                                            <p className="user-message">
                                                {previousInputs[idx - 2]}
                                            </p>
                                        </div>
                                    )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            <div className="input-box d-flex flex-row justify-content-start mb-4">
                <InputGroup className="mb-3">
                    <Form.Control
                        disabled={isFirstRun}
                        aria-label="user-input"
                        aria-describedby="chat-form"
                        value={userInput}
                        onChange={(event) => {
                            event.preventDefault();
                            setUserInput(event.target.value);
                        }}
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                                sendMessage(event);
                            }
                        }}
                        style={{
                            boxShadow: '0px 4px 4px 0px #00000040',
                        }}
                    />
                    <Button
                        disabled={isFirstRun}
                        style={{
                            backgroundColor: 'white',
                            borderColor: '#B4B4B4',
                            boxShadow: '0px 4px 4px 0px #00000040',
                        }}
                        onClick={sendMessage}
                    >
                        <img id="icon-send" src="iconsend.png"></img>
                    </Button>
                </InputGroup>
            </div>
        </>
    );
}

export default App;

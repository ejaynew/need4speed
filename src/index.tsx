import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

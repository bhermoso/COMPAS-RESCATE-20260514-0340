import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

let mountNode = document.getElementById('sala-react-root');
if (!mountNode) {
  mountNode = document.createElement('div');
  mountNode.id = 'sala-react-root';
  document.body.appendChild(mountNode);
}

createRoot(mountNode).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

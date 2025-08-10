import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';
import './assets/style.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

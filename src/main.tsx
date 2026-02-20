/**
 * エントリーポイント
 * Entry Point
 * 
 * アプリケーションのエントリーポイント。
 * ReactアプリケーションをDOMにマウントする。
 * 
 * Application entry point.
 * Mounts React application to the DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './styles/App.module.css';

// Reactアプリケーションをルート要素にマウント
// Mount React application to root element
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/edo-time-jp/">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);


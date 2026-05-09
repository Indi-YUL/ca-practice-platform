/**
 * FRONTEND - Vite entry point
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// TODO: Import App component

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      {/* <App /> */}
    </React.StrictMode>,
  );
}

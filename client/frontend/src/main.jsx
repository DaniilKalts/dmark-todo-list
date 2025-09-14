import React from 'react';

import { createRoot } from 'react-dom/client';

import App from './App.jsx';

import { getInitialTheme } from './hooks/useTheme';

import './style.css';

const __initial = getInitialTheme();

if (__initial === 'dark') document.body.classList.add('dark');
else document.body.classList.remove('dark');

const container = document.getElementById('root');

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

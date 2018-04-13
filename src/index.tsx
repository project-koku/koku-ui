import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

declare global {
  const BUNDLED_LANGUAGE: string;
}

const root = document.getElementById('root');

render(
  <BrowserRouter>
    <App language={BUNDLED_LANGUAGE} />
  </BrowserRouter>,
  root
);

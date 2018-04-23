import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = document.getElementById('root');

render(
  <React.StrictMode>
    <BrowserRouter>
      <App locale={BUNDLED_LOCALE} />
    </BrowserRouter>
  </React.StrictMode>,
  root
);

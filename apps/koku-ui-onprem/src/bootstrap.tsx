import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/react-styles/css/utilities/Spacing/spacing.css';
import '@patternfly/react-styles/css/utilities/Text/text.css';

import { axiosInstance } from '@koku-ui/ui-lib/api';
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App/App';

axiosInstance.interceptors.response.use(null, error => {
  if (error?.response?.status === 401) {
    window.location.href = '/logout';
  }
  return Promise.reject(error);
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

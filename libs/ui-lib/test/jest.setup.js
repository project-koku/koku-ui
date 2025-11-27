/* eslint-disable simple-import-sort/imports */
import React from 'react';
import '@testing-library/jest-dom';

// Silence PF Truncate innerRef warning globally in tests
jest.mock('@patternfly/react-core', () => {
  const actual = jest.requireActual('@patternfly/react-core');
  return {
    __esModule: true,
    ...actual,
    Truncate: ({ content }) => <span>{content}</span>,
  };
});

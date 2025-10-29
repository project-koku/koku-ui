import '@testing-library/jest-dom';
import React from 'react';

// Silence PF Truncate innerRef warning globally in tests
jest.mock('@patternfly/react-core', () => {
  const actual = jest.requireActual('@patternfly/react-core');
  return {
    __esModule: true,
    ...actual,
    Truncate: ({ content }) => <span>{content}</span>,
  };
});

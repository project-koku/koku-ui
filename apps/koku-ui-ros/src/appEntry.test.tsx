import { render, screen } from '@testing-library/react';
import React from 'react';

import AppEntry from './appEntry';

jest.mock('@redhat-cloud-services/frontend-components-notifications/NotificationPortal', () => () => (
  <div data-testid="notifications-portal" />
));

jest.mock('./app', () => () => <div data-testid="app" />);

jest.mock('./store', () => ({
  rosStore: { getState: () => ({}), dispatch: jest.fn(), subscribe: jest.fn() },
}));

jest.mock('components/i18n', () => ({
  getLocale: () => 'en',
  ignoreDefaultMessageError: jest.fn(),
}));

describe('AppEntry', () => {
  test('renders the app inside providers', () => {
    render(<AppEntry />);

    expect(screen.getByTestId('app')).toBeInTheDocument();
    expect(screen.getByTestId('notifications-portal')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { getOperatorStatus } from './operatorStatus';

describe('getOperatorStatus', () => {
  const renderStatus = (status: boolean | undefined) =>
    render(<IntlProvider locale="en">{getOperatorStatus(status as boolean)}</IntlProvider>);

  test('shows new version label when update available', () => {
    renderStatus(true);
    expect(screen.getByText(/new version available/i)).toBeInTheDocument();
  });

  test('shows up to date when status is false', () => {
    renderStatus(false);
    expect(screen.getByText(/up to date/i)).toBeInTheDocument();
  });

  test('shows not available for other values', () => {
    renderStatus(undefined as any);
    expect(screen.getByText(/not available/i)).toBeInTheDocument();
  });
});

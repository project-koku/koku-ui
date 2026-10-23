import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AxiosError } from 'axios';
import React from 'react';
import { IntlProvider } from 'react-intl';

import NotAvailable from './notAvailable';

const renderNotAvailable = (ui: React.ReactElement) => render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('NotAvailable', () => {
  test('renders unavailable content without error details', () => {
    renderNotAvailable(<NotAvailable />);
    expect(screen.getByRole('heading', { name: /temporarily unavailable/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /show details/i })).not.toBeInTheDocument();
  });

  test('renders a title when provided', () => {
    renderNotAvailable(<NotAvailable title="OpenShift details" />);
    expect(screen.getByRole('heading', { name: 'OpenShift details' })).toBeInTheDocument();
  });

  test('shows API error details in an expandable section', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const error = {
      response: { data: { errors: [{ detail: 'source already exists' }] } },
    } as AxiosError;

    renderNotAvailable(<NotAvailable error={error} />);

    expect(
      screen.getByText(
        'Try refreshing the page. If the problem persists, contact your organization administrator or visit our status page for known outages.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('source already exists')).not.toBeVisible();

    await user.click(screen.getByRole('button', { name: /show details/i }));
    expect(screen.getByText('source already exists')).toBeVisible();
  });

  test('omits the expandable section when the error has no usable detail', () => {
    renderNotAvailable(<NotAvailable error={{} as AxiosError} />);
    expect(screen.queryByRole('button', { name: /show details/i })).not.toBeInTheDocument();
  });
});

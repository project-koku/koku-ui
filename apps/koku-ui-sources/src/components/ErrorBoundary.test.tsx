import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';

import localeMessages from '../../locales/data.json';
import { ErrorBoundary } from './ErrorBoundary';

describe('ErrorBoundary', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <IntlProvider locale="en" messages={localeMessages.en}>
        <ErrorBoundary>
          <div>ok</div>
        </ErrorBoundary>
      </IntlProvider>
    );

    expect(screen.getByText('ok')).toBeInTheDocument();
  });

  it('renders the fallback when a child throws and recovers after Try again', async () => {
    const user = userEvent.setup();
    let shouldThrow = true;
    const Flaky = () => {
      if (shouldThrow) {
        throw new Error('wrapper exploded');
      }
      return <div>recovered</div>;
    };

    render(
      <IntlProvider locale="en" messages={localeMessages.en}>
        <ErrorBoundary>
          <Flaky />
        </ErrorBoundary>
      </IntlProvider>
    );

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByText('wrapper exploded')).toBeInTheDocument();

    shouldThrow = false;
    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(screen.getByText('recovered')).toBeInTheDocument();
  });

  it('shows a generic message when the thrown error has no message', () => {
    const ThrowEmpty = () => {
      throw new Error();
    };

    render(
      <IntlProvider locale="en" messages={localeMessages.en}>
        <ErrorBoundary>
          <ThrowEmpty />
        </ErrorBoundary>
      </IntlProvider>
    );

    expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument();
  });
});

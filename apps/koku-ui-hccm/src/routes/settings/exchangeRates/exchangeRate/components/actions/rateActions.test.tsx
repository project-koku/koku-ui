import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import messages from '../../../../../../../locales/translations.json';
import { RateActions } from './rateActions';

jest.mock('routes/settings/exchangeRates/exchangeRate/components/edit', () => {
  const React = require('react');
  return {
    EditRate: React.forwardRef((_props: unknown, ref: React.Ref<{ open: () => void }>) => {
      const [isOpen, setIsOpen] = React.useState(false);
      React.useImperativeHandle(ref, () => ({ open: () => setIsOpen(true) }));
      return isOpen ? <div data-testid="edit-rate-dialog">Edit exchange rate</div> : null;
    }),
  };
});

jest.mock('routes/settings/exchangeRates/exchangeRate/components/duplicate', () => {
  const React = require('react');
  return {
    DuplicateRate: React.forwardRef((_props: unknown, ref: React.Ref<{ open: () => void }>) => {
      const [isOpen, setIsOpen] = React.useState(false);
      React.useImperativeHandle(ref, () => ({ open: () => setIsOpen(true) }));
      return isOpen ? <div data-testid="duplicate-rate-dialog">Duplicate exchange rate</div> : null;
    }),
  };
});

jest.mock('routes/settings/exchangeRates/exchangeRate/components/delete', () => {
  const React = require('react');
  return {
    DeleteRate: React.forwardRef((_props: unknown, ref: React.Ref<{ delete: () => void }>) => {
      const [didDelete, setDidDelete] = React.useState(false);
      React.useImperativeHandle(ref, () => ({ delete: () => setDidDelete(true) }));
      return didDelete ? <div data-testid="delete-rate-invoked">Rate removed</div> : null;
    }),
  };
});

describe('RateActions', () => {
  const settings = [] as any;

  const renderActions = (ui: React.ReactElement) =>
    render(
      <IntlProvider locale="en" messages={messages}>
        {ui}
      </IntlProvider>
    );

  test('kebab edit opens the edit dialog', async () => {
    renderActions(<RateActions canWrite settings={settings} uuid="rate-1" />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /edit rate/i }));
    expect(await screen.findByTestId('edit-rate-dialog')).toBeInTheDocument();
    expect(screen.getByText(/edit exchange rate/i)).toBeInTheDocument();
  });

  test('kebab duplicate opens the duplicate dialog', async () => {
    renderActions(<RateActions canWrite settings={settings} uuid="rate-1" />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /duplicate/i }));
    expect(await screen.findByTestId('duplicate-rate-dialog')).toBeInTheDocument();
    expect(screen.getByText(/duplicate exchange rate/i)).toBeInTheDocument();
  });

  test('kebab remove invokes delete', async () => {
    renderActions(<RateActions canWrite settings={settings} uuid="rate-1" />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /^remove$/i }));
    await waitFor(() => expect(screen.getByTestId('delete-rate-invoked')).toBeInTheDocument());
  });

  test('disables menu items when canWrite is false', async () => {
    renderActions(<RateActions canWrite={false} settings={settings} uuid="rate-1" />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    expect(await screen.findByRole('menuitem', { name: /edit rate/i })).toHaveAttribute('aria-disabled', 'true');
  });
});

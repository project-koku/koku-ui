import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import messages from '../../../../../../../locales/translations.json';
import { RateActions } from './rateActions';

const openEditSpy = jest.fn();
const openDuplicateSpy = jest.fn();
const deleteSpy = jest.fn();

jest.mock('routes/settings/exchangeRates/exchangeRate/components/edit', () => {
  const React = require('react');
  return {
    EditRate: React.forwardRef((_props: unknown, ref: React.Ref<{ open: () => void }>) => {
      React.useImperativeHandle(ref, () => ({ open: openEditSpy }));
      return null;
    }),
  };
});

jest.mock('routes/settings/exchangeRates/exchangeRate/components/duplicate', () => {
  const React = require('react');
  return {
    DuplicateRate: React.forwardRef((_props: unknown, ref: React.Ref<{ open: () => void }>) => {
      React.useImperativeHandle(ref, () => ({ open: openDuplicateSpy }));
      return null;
    }),
  };
});

jest.mock('routes/settings/exchangeRates/exchangeRate/components/delete', () => {
  const React = require('react');
  return {
    DeleteRate: React.forwardRef((_props: unknown, ref: React.Ref<{ delete: () => void }>) => {
      React.useImperativeHandle(ref, () => ({ delete: deleteSpy }));
      return null;
    }),
  };
});

describe('RateActions', () => {
  const settings = [] as any;

  beforeEach(() => {
    openEditSpy.mockClear();
    openDuplicateSpy.mockClear();
    deleteSpy.mockClear();
  });

  const renderActions = (ui: React.ReactElement) =>
    render(
      <IntlProvider locale="en" messages={messages}>
        {ui}
      </IntlProvider>
    );

  test('kebab edit invokes imperative open on EditRate', async () => {
    renderActions(<RateActions canWrite settings={settings} uuid="rate-1" />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /edit rate/i }));
    await waitFor(() => expect(openEditSpy).toHaveBeenCalled());
  });

  test('kebab duplicate invokes imperative open on DuplicateRate', async () => {
    renderActions(<RateActions canWrite settings={settings} uuid="rate-1" />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /duplicate/i }));
    await waitFor(() => expect(openDuplicateSpy).toHaveBeenCalled());
  });

  test('kebab remove invokes imperative delete on DeleteRate', async () => {
    renderActions(<RateActions canWrite settings={settings} uuid="rate-1" />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /^remove$/i }));
    await waitFor(() => expect(deleteSpy).toHaveBeenCalled());
  });

  test('disables menu items when canWrite is false', async () => {
    renderActions(<RateActions canWrite={false} settings={settings} uuid="rate-1" />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    expect(await screen.findByRole('menuitem', { name: /edit rate/i })).toHaveAttribute('aria-disabled', 'true');
  });
});

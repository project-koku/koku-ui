import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { RateActions } from './rateActions';

const openEditSpy = jest.fn();
const openDeleteSpy = jest.fn();

jest.mock('routes/settings/priceList/priceListBreakdown/rates/components/delete', () => {
  const React = require('react');
  return {
    DeleteRate: React.forwardRef((_props: unknown, ref: React.Ref<{ open: () => void }>) => {
      React.useImperativeHandle(ref, () => ({ open: openDeleteSpy }));
      return null;
    }),
  };
});

jest.mock('routes/settings/priceList/priceListBreakdown/rates/components/edit', () => {
  const React = require('react');
  return {
    EditRate: React.forwardRef((_props: unknown, ref: React.Ref<{ open: () => void }>) => {
      React.useImperativeHandle(ref, () => ({ open: openEditSpy }));
      return null;
    }),
  };
});

describe('RateActions', () => {
  const renderActions = (ui: React.ReactElement) =>
    render(
      <IntlProvider defaultLocale="en" locale="en">
        {ui}
      </IntlProvider>
    );

  const priceList = { assigned_cost_model_count: 0, name: 'PL', uuid: 'pl-1' } as any;

  beforeEach(() => {
    openEditSpy.mockClear();
    openDeleteSpy.mockClear();
  });

  test('kebab edit invokes imperative open on EditRate', async () => {
    renderActions(<RateActions canWrite priceList={priceList} rateIndex={0} />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /edit rate/i }));
    await waitFor(() => expect(openEditSpy).toHaveBeenCalled());
  });

  test('kebab delete invokes imperative open on DeleteRate', async () => {
    renderActions(<RateActions canWrite priceList={priceList} rateIndex={0} />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /^delete$/i }));
    await waitFor(() => expect(openDeleteSpy).toHaveBeenCalled());
  });
});

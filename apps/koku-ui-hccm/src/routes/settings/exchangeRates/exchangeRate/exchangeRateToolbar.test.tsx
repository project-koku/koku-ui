import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import messages from '../../../../../locales/translations.json';
import { ExchangeRateToolbar } from './exchangeRateToolbar';

jest.mock('./components/add', () => ({
  AddRate: ({ canWrite }: { canWrite?: boolean }) => (
    <button type="button" aria-disabled={!canWrite ? 'true' : undefined}>
      Create exchange rate
    </button>
  ),
}));

jest.mock('routes/components/dataToolbar', () => ({
  BasicToolbar: ({ actions }: { actions?: React.ReactNode }) => <div data-testid="basic-toolbar">{actions}</div>,
}));

describe('ExchangeRateToolbar', () => {
  const noop = jest.fn();
  const baseQuery = { filter_by: {}, limit: 10, offset: 0 } as any;

  const renderToolbar = (ui: React.ReactElement) =>
    render(
      <IntlProvider locale="en" messages={messages}>
        {ui}
      </IntlProvider>
    );

  beforeEach(() => {
    noop.mockClear();
  });

  test('renders show disabled switch and create action when writable', () => {
    renderToolbar(
      <ExchangeRateToolbar
        canWrite
        isDisabled={false}
        isShowDisabled={false}
        itemsPerPage={10}
        itemsTotal={1}
        onFilterAdded={noop}
        onFilterRemoved={noop}
        onShowDeprecated={noop}
        query={baseQuery}
      />
    );

    expect(screen.getByRole('switch', { name: /show disabled/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create exchange rate/i })).toBeInTheDocument();
  });

  test('disables create action when not writable', () => {
    renderToolbar(
      <ExchangeRateToolbar
        canWrite={false}
        isDisabled={false}
        isShowDisabled={false}
        itemsPerPage={10}
        itemsTotal={1}
        onFilterAdded={noop}
        onFilterRemoved={noop}
        onShowDeprecated={noop}
        query={baseQuery}
      />
    );

    expect(screen.getByRole('button', { name: /create exchange rate/i })).toHaveAttribute('aria-disabled', 'true');
  });

  test('invokes onShowDeprecated when show disabled is toggled', () => {
    const onShowDeprecated = jest.fn();
    renderToolbar(
      <ExchangeRateToolbar
        canWrite
        isDisabled={false}
        isShowDisabled={false}
        itemsPerPage={10}
        itemsTotal={1}
        onFilterAdded={noop}
        onFilterRemoved={noop}
        onShowDeprecated={onShowDeprecated}
        query={baseQuery}
      />
    );

    fireEvent.click(screen.getByRole('switch', { name: /show disabled/i }));
    expect(onShowDeprecated).toHaveBeenCalledWith(true);
  });
});

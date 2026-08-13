import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import messages from '../../../../../../locales/translations.json';
import type { RateContentHandle } from './rateContent';
import { RateContent } from './rateContent';

jest.mock('components/i18n', () => ({
  __esModule: true,
  getLocale: () => 'en',
  intl: {
    formatMessage: (m: { id?: string; defaultMessage?: string } | string) =>
      typeof m === 'string' ? m : m?.defaultMessage || m?.id || 'msg',
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat('en', options).format(value),
    formatNumberToParts: (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat('en', options).formatToParts(value),
  },
}));

jest.mock('routes/components/currency', () => ({
  useCurrencySettings: () => ({
    settings: {
      data: [
        {
          code: 'USD',
          static_rates: [
            {
              uuid: 'rate-1',
              base_currency: 'USD',
              target_currency: 'EUR',
              start_date: '2026-08-01',
              end_date: '2026-08-31',
              exchange_rate: 1.1,
            },
          ],
        },
      ],
    },
  }),
  CurrencyWrapper: ({
    id,
    value,
    onSelect,
    isDisabled,
    label,
  }: {
    id?: string;
    value?: string;
    onSelect?: (evt: unknown, value: string) => void;
    isDisabled?: boolean;
    label?: string;
  }) => (
    <div>
      {label}
      <button
        type="button"
        data-testid={id}
        disabled={isDisabled}
        onClick={() => onSelect?.(null, id === 'base-currency' ? 'GBP' : 'JPY')}
      >
        {value || 'select'}
      </button>
    </div>
  ),
}));

const noopStore = createStore(() => ({}));

const sampleSettings = [
  {
    code: 'USD',
    static_rates: [
      {
        uuid: 'rate-1',
        base_currency: 'USD',
        target_currency: 'EUR',
        start_date: '2026-08-01',
        end_date: '2026-08-31',
        exchange_rate: 1.1,
      },
    ],
  },
] as any;

const getRateInput = (container: HTMLElement) => container.querySelector('#exchange-rate') as HTMLInputElement;

describe('RateContent', () => {
  const renderContent = (ui: React.ReactElement) =>
    render(
      <Provider store={noopStore}>
        <IntlProvider locale="en" messages={messages}>
          {ui}
        </IntlProvider>
      </Provider>
    );

  test('renders currency pair and exchange rate fields for add mode', () => {
    const { container } = renderContent(<RateContent isAddRate />);
    expect(screen.getByText(/currency pair/i)).toBeInTheDocument();
    expect(getRateInput(container)).toBeInTheDocument();
    expect(screen.getByText(/validity period/i)).toBeInTheDocument();
  });

  test('disables base currency and swap in edit mode', () => {
    renderContent(<RateContent settings={sampleSettings} uuid="rate-1" />);
    expect(screen.getByTestId('base-currency')).toBeDisabled();
    expect(screen.getByRole('button', { name: /swap currencies/i })).toHaveAttribute('aria-disabled', 'true');
  });

  test('enables swap when both currencies are selected in add mode', () => {
    renderContent(<RateContent isAddRate />);
    fireEvent.click(screen.getByTestId('base-currency'));
    fireEvent.click(screen.getByTestId('target-currency'));
    expect(screen.getByRole('button', { name: /swap currencies/i })).not.toBeDisabled();
  });

  test('swaps currencies when swap is clicked', () => {
    renderContent(<RateContent isAddRate />);
    fireEvent.click(screen.getByTestId('base-currency'));
    fireEvent.click(screen.getByTestId('target-currency'));
    fireEvent.click(screen.getByRole('button', { name: /swap currencies/i }));
    expect(screen.getByTestId('base-currency')).toHaveTextContent('JPY');
    expect(screen.getByTestId('target-currency')).toHaveTextContent('GBP');
  });

  test('shows validation error for invalid rate', () => {
    const { container } = renderContent(<RateContent isAddRate />);
    fireEvent.change(getRateInput(container), { target: { value: 'abc' } });
    expect(screen.getByText(/rate must be a number/i)).toBeInTheDocument();
  });

  test('dismisses validity period info alert', () => {
    renderContent(<RateContent isAddRate />);
    expect(screen.getByText(/start period must be the same as or before the end period/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByText(/start period must be the same as or before the end period/i)).not.toBeInTheDocument();
  });

  test('save() invokes onSave with form values in edit mode after a change', async () => {
    const onSave = jest.fn();
    const ref = createRef<RateContentHandle>();
    const { container } = renderContent(
      <RateContent ref={ref} onSave={onSave} settings={sampleSettings} uuid="rate-1" />
    );

    fireEvent.change(getRateInput(container), { target: { value: '2.5' } });

    await act(async () => {
      ref.current?.save();
    });

    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        base_currency: 'USD',
        target_currency: 'EUR',
      })
    );
    expect(onSave.mock.calls[0][0].exchange_rate).toBeDefined();
  });

  test('reports disabled state via onDisabled', async () => {
    const onDisabled = jest.fn();
    renderContent(<RateContent isAddRate onDisabled={onDisabled} />);
    await waitFor(() => expect(onDisabled).toHaveBeenCalledWith(true));
  });
});

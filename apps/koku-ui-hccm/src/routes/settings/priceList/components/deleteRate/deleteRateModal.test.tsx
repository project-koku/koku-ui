import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { configureStore } from 'store/store';

import { DeleteRateModal } from './deleteRateModal';

describe('DeleteRateModal', () => {
  test('shows delete dialog with metric and price list context', () => {
    const store = configureStore({} as any);
    const priceList = {
      name: 'My list',
      uuid: 'pl-del',
      assigned_cost_model_count: 0,
      rates: [
        {
          metric: { name: 'm1', label_metric: 'CPU' },
          tiered_rates: [{ unit: 'USD', value: 1 }],
        },
      ],
    } as any;

    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <DeleteRateModal isOpen onClose={jest.fn()} priceList={priceList} rateIndex={0} />
        </IntlProvider>
      </Provider>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/delete rate/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^delete$/i })).toBeInTheDocument();
  });
});

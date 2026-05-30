import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { NoPriceListState } from './noPriceListState';
import { NoSelectionsState } from './noSelectionsState';

jest.mock('../actions', () => ({
  AddPriceListAction: () => <button type="button">add-price-list</button>,
}));

const costModel = { uuid: 'cm-1', name: 'Model' } as any;

describe('price list state components', () => {
  test('NoPriceListState renders empty message', () => {
    render(
      <IntlProvider locale="en">
        <NoPriceListState canWrite costModel={costModel} onAdd={jest.fn()} />
      </IntlProvider>
    );
    expect(screen.getByText(/no price lists are assigned/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add-price-list/i })).toBeInTheDocument();
  });

  test('NoSelectionsState renders message', () => {
    render(
      <IntlProvider locale="en">
        <NoSelectionsState />
      </IntlProvider>
    );
    expect(screen.getByText(/no price lists selected/i)).toBeInTheDocument();
  });
});

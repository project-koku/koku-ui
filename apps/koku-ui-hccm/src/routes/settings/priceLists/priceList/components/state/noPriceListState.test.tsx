import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { NoPriceListState } from './noPriceListState';

describe('NoPriceListState', () => {
  test('renders empty state message', () => {
    render(
      <IntlProvider locale="en">
        <NoPriceListState />
      </IntlProvider>
    );

    expect(screen.getByText(/no active price lists/i)).toBeInTheDocument();
    expect(screen.getByText(/show deprecated/i)).toBeInTheDocument();
  });
});

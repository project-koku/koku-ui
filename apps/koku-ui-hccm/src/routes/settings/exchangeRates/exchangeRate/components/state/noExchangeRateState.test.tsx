import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import messages from '../../../../../../../locales/translations.json';
import { NoExchangeRateState } from './noExchangeRateState';

describe('NoExchangeRateState', () => {
  test('renders empty state message', () => {
    render(
      <IntlProvider locale="en" messages={messages}>
        <NoExchangeRateState />
      </IntlProvider>
    );

    expect(screen.getByText(/no exchange rates/i)).toBeInTheDocument();
    expect(screen.getByText(/show disabled/i)).toBeInTheDocument();
  });
});

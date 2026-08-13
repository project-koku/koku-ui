import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import messages from '../../../../../../../locales/translations.json';
import { NoExchangeRateAssignedState } from './noExchangeRateAssignedState';

jest.mock('routes/settings/exchangeRates/exchangeRate/components/add', () => ({
  AddRate: ({ canWrite }: { canWrite?: boolean }) => (
    <button type="button" disabled={!canWrite}>
      Create exchange rate
    </button>
  ),
}));

describe('NoExchangeRateAssignedState', () => {
  test('renders empty state with create action when canWrite', () => {
    render(
      <IntlProvider locale="en" messages={messages}>
        <NoExchangeRateAssignedState canWrite />
      </IntlProvider>
    );

    expect(screen.getByText(/no exchange rates are assigned/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create exchange rate/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create exchange rate/i })).not.toBeDisabled();
  });

  test('disables create action when canWrite is false', () => {
    render(
      <IntlProvider locale="en" messages={messages}>
        <NoExchangeRateAssignedState canWrite={false} />
      </IntlProvider>
    );

    expect(screen.getByRole('button', { name: /create exchange rate/i })).toBeDisabled();
  });
});

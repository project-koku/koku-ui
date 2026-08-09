import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import messages from '../../../../../../../locales/translations.json';
import { AddRate } from './addRate';

jest.mock('./addRateModal', () => ({
  AddRateModal: ({ isOpen }: { isOpen?: boolean }) => (isOpen ? <div data-testid="add-rate-modal-open" /> : null),
}));

describe('AddRate', () => {
  test('opens add modal when create button is clicked', () => {
    render(
      <IntlProvider locale="en" messages={messages}>
        <AddRate canWrite />
      </IntlProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /create exchange rate/i }));
    expect(screen.getByTestId('add-rate-modal-open')).toBeInTheDocument();
  });

  test('disables create button when canWrite is false', () => {
    render(
      <IntlProvider locale="en" messages={messages}>
        <AddRate canWrite={false} />
      </IntlProvider>
    );

    expect(screen.getByRole('button', { name: /create exchange rate/i })).toHaveAttribute('aria-disabled', 'true');
  });
});

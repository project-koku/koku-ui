import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { AddRate } from './addRate';

jest.mock('./addRateModal', () => ({
  AddRateModal: ({ isOpen }: { isOpen?: boolean }) =>
    isOpen ? <div data-testid="add-rate-modal-open" /> : null,
}));

jest.mock('routes/settings/priceList/components/review', () => ({
  ImpactReviewModal: ({ isOpen }: { isOpen?: boolean }) =>
    isOpen ? <div data-testid="impact-modal-open" /> : null,
}));

describe('AddRate', () => {
  test('opens add modal directly when no assigned cost models', () => {
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <AddRate canWrite priceList={{ assigned_cost_model_count: 0, uuid: 'pl' } as any} />
      </IntlProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /add rate/i }));
    expect(screen.getByTestId('add-rate-modal-open')).toBeInTheDocument();
  });

  test('opens impact review first when cost models are assigned', () => {
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <AddRate canWrite priceList={{ assigned_cost_model_count: 2, uuid: 'pl' } as any} />
      </IntlProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /add rate/i }));
    expect(screen.getByTestId('impact-modal-open')).toBeInTheDocument();
  });
});

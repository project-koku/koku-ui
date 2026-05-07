import { render, screen, waitFor, act } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';

import type { EditRateHandle } from './editRate';
import { EditRate } from './editRate';

jest.mock('./editRateModal', () => ({
  EditRateModal: ({ isOpen }: { isOpen?: boolean }) =>
    isOpen ? <div data-testid="edit-rate-modal-open" /> : null,
}));

jest.mock('routes/settings/priceList/components/review', () => ({
  ImpactReviewModal: ({ isOpen }: { isOpen?: boolean }) =>
    isOpen ? <div data-testid="impact-modal-open" /> : null,
}));

describe('EditRate', () => {
  test('open() shows edit modal when no assigned cost models', async () => {
    const ref = createRef<EditRateHandle>();
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <EditRate ref={ref} priceList={{ assigned_cost_model_count: 0, uuid: 'pl' } as any} rateIndex={0} />
      </IntlProvider>
    );
    await act(async () => {
      ref.current?.open();
    });
    await waitFor(() => expect(screen.getByTestId('edit-rate-modal-open')).toBeInTheDocument());
  });

  test('open() shows impact modal when cost models are assigned', async () => {
    const ref = createRef<EditRateHandle>();
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <EditRate ref={ref} priceList={{ assigned_cost_model_count: 1, uuid: 'pl' } as any} rateIndex={0} />
      </IntlProvider>
    );
    await act(async () => {
      ref.current?.open();
    });
    await waitFor(() => expect(screen.getByTestId('impact-modal-open')).toBeInTheDocument());
  });
});

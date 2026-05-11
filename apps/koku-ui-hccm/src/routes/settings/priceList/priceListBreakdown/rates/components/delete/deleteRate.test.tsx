import { render, screen, waitFor, act } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';

import type { DeleteRateHandle } from './deleteRate';
import { DeleteRate } from './deleteRate';

jest.mock('./deleteRateModal', () => ({
  DeleteRateModal: ({ isOpen }: { isOpen?: boolean }) =>
    isOpen ? <div data-testid="delete-rate-modal-open" /> : null,
}));

jest.mock('routes/settings/priceList/priceListBreakdown/rates/components/review', () => ({
  ReviewModal: ({ isOpen }: { isOpen?: boolean }) =>
    isOpen ? <div data-testid="impact-modal-open" /> : null,
}));

describe('DeleteRate', () => {
  test('open() shows delete modal when no assigned cost models', async () => {
    const ref = createRef<DeleteRateHandle>();
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <DeleteRate ref={ref} priceList={{ assigned_cost_model_count: 0, uuid: 'pl' } as any} rateIndex={0} />
      </IntlProvider>
    );
    await act(async () => {
      ref.current?.open();
    });
    await waitFor(() => expect(screen.getByTestId('delete-rate-modal-open')).toBeInTheDocument());
  });

  test('open() shows impact modal when cost models are assigned', async () => {
    const ref = createRef<DeleteRateHandle>();
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <DeleteRate ref={ref} priceList={{ assigned_cost_model_count: 3, uuid: 'pl' } as any} rateIndex={0} />
      </IntlProvider>
    );
    await act(async () => {
      ref.current?.open();
    });
    await waitFor(() => expect(screen.getByTestId('impact-modal-open')).toBeInTheDocument());
  });
});

import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';

import type { DeleteRateHandle } from './deleteRate';
import { DeleteRate } from './deleteRate';

jest.mock('./deleteRateModal', () => ({
  DeleteRateModal: ({ isOpen }: { isOpen?: boolean }) =>
    isOpen ? <div data-testid="delete-rate-modal-open" /> : null,
}));

jest.mock('routes/settings/priceLists/priceListBreakdown/rates/components/review', () => ({
  ReviewImpactModal: ({
    isOpen,
    onConfirm,
    onClose,
  }: {
    isOpen?: boolean;
    onConfirm?: () => void;
    onClose?: () => void;
  }) =>
    isOpen ? (
      <div data-testid="impact-modal-open">
        <button type="button" onClick={onConfirm}>
          impact-continue
        </button>
        <button type="button" onClick={onClose}>
          impact-close
        </button>
      </div>
    ) : null,
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

  test('impact confirm opens delete modal', async () => {
    const ref = createRef<DeleteRateHandle>();
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <DeleteRate ref={ref} priceList={{ assigned_cost_model_count: 2, uuid: 'pl' } as any} rateIndex={0} />
      </IntlProvider>
    );
    await act(async () => {
      ref.current?.open();
    });
    fireEvent.click(screen.getByRole('button', { name: /impact-continue/i }));
    await waitFor(() => expect(screen.getByTestId('delete-rate-modal-open')).toBeInTheDocument());
  });
});

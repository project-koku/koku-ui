import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { DeleteRateAction } from './deleteRateAction';

jest.mock('./deleteRateModal', () => ({
  DeleteRateModal: ({ isOpen }: { isOpen?: boolean }) =>
    isOpen ? <div data-testid="delete-rate-modal-open" /> : null,
}));

describe('DeleteRateAction', () => {
  test('click toggles delete modal', () => {
    const onClose = jest.fn();
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <DeleteRateAction canWrite priceList={{ uuid: 'p1' } as any} rateIndex={0} onClose={onClose} />
      </IntlProvider>
    );
    const btn = screen.getByRole('button', { name: /remove child tag/i });
    fireEvent.click(btn);
    expect(screen.getByTestId('delete-rate-modal-open')).toBeInTheDocument();
    fireEvent.click(btn);
    expect(screen.queryByTestId('delete-rate-modal-open')).not.toBeInTheDocument();
  });

  test('cannot interact when read-only', () => {
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <DeleteRateAction canWrite={false} priceList={{ uuid: 'p1' } as any} rateIndex={1} />
      </IntlProvider>
    );
    expect(screen.getByRole('button', { name: /remove child tag/i })).toHaveAttribute('aria-disabled', 'true');
  });
});

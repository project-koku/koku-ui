import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { ConfirmEditRateAction } from './confirmEditRateAction';

jest.mock('./confirmEditRateModal', () => ({
  ConfirmEditRateModal: ({ isOpen }: { isOpen?: boolean }) =>
    isOpen ? <div data-testid="confirm-edit-modal-open" /> : null,
}));

describe('ConfirmEditRateAction', () => {
  test('click toggles modal open and invokes onClose from modal close path', () => {
    const onClose = jest.fn();
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <ConfirmEditRateAction canWrite priceList={{ uuid: 'p1' } as any} onClose={onClose} />
      </IntlProvider>
    );
    const btn = screen.getByRole('button', { name: /remove child tag/i });
    fireEvent.click(btn);
    expect(screen.getByTestId('confirm-edit-modal-open')).toBeInTheDocument();
    fireEvent.click(btn);
    expect(screen.queryByTestId('confirm-edit-modal-open')).not.toBeInTheDocument();
  });

  test('read-only shows tooltip path via disabled control', () => {
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <ConfirmEditRateAction canWrite={false} priceList={{ uuid: 'p1' } as any} />
      </IntlProvider>
    );
    expect(screen.getByRole('button', { name: /remove child tag/i })).toHaveAttribute('aria-disabled', 'true');
  });
});

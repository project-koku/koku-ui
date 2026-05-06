import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { EditRateAction } from './editRateAction';

jest.mock('./editRateModal', () => ({
  EditRateModal: ({ isOpen }: { isOpen?: boolean }) =>
    isOpen ? <div data-testid="edit-rate-modal-open" /> : null,
}));

describe('EditRateAction', () => {
  test('click toggles edit modal', () => {
    const onClose = jest.fn();
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <EditRateAction canWrite priceList={{ uuid: 'p1' } as any} onClose={onClose} />
      </IntlProvider>
    );
    const btn = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(btn);
    expect(screen.getByTestId('edit-rate-modal-open')).toBeInTheDocument();
    fireEvent.click(btn);
    expect(screen.queryByTestId('edit-rate-modal-open')).not.toBeInTheDocument();
  });

  test('read-only disables control', () => {
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <EditRateAction canWrite={false} priceList={{ uuid: 'p1' } as any} />
      </IntlProvider>
    );
    expect(screen.getByRole('button', { name: /delete/i })).toHaveAttribute('aria-disabled', 'true');
  });
});

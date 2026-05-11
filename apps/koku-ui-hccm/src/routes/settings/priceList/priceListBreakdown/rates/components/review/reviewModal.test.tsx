import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { ReviewModal } from './reviewModal';

describe('ReviewModal', () => {
  test('continue stays disabled until checkbox is checked', () => {
    const onConfirm = jest.fn();
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <ReviewModal
          isOpen
          onConfirm={onConfirm}
          priceList={
            {
              assigned_cost_models: [{ name: 'Model A' }],
            } as any
          }
        />
      </IntlProvider>
    );
    const dialog = screen.getByRole('dialog');
    const continueBtn = within(dialog).getByRole('button', { name: /^continue$/i });
    expect(continueBtn).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(screen.getByRole('checkbox'));
    expect(continueBtn).not.toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(continueBtn);
    expect(onConfirm).toHaveBeenCalled();
  });

  test('resets checkbox when reopened', () => {
    const { rerender } = render(
      <IntlProvider defaultLocale="en" locale="en">
        <ReviewModal isOpen={false} priceList={{ assigned_cost_models: [] } as any} />
      </IntlProvider>
    );
    rerender(
      <IntlProvider defaultLocale="en" locale="en">
        <ReviewModal isOpen priceList={{ assigned_cost_models: [{ name: 'X' }] } as any} />
      </IntlProvider>
    );
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { ConfirmEditRateModal } from './confirmEditRateModal';

describe('ConfirmEditRateModal', () => {
  test('requires checkbox before continue is enabled', () => {
    const onContinue = jest.fn();
    const onClose = jest.fn();
    const priceList = {
      assigned_cost_models: [{ name: 'CM1' }],
    } as any;

    render(
      <IntlProvider defaultLocale="en" locale="en">
        <ConfirmEditRateModal isOpen onClose={onClose} onContinue={onContinue} priceList={priceList} />
      </IntlProvider>
    );

    const continueBtn = screen.getByRole('button', { name: /^continue$/i });
    expect(continueBtn).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(screen.getByRole('checkbox'));
    expect(continueBtn).not.toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(continueBtn);
    expect(onContinue).toHaveBeenCalled();
  });
});

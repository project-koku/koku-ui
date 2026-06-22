import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { Markup } from './markup';

describe('Markup step', () => {
  test('renders markup controls and updates value on change', () => {
    const onMarkupChange = jest.fn();
    const onDiscountChange = jest.fn();

    render(
      <IntlProvider locale="en">
        <Markup
          isDiscount={false}
          markup="0"
          onDiscountChange={onDiscountChange}
          onMarkupChange={onMarkupChange}
        />
      </IntlProvider>
    );

    expect(screen.getByRole('heading', { name: /cost calculations \(optional\)/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /markup or discount/i })).toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox', { name: /rate/i }), { target: { value: '25' } });
    expect(onMarkupChange).toHaveBeenCalledWith('25');

    fireEvent.click(screen.getByRole('radio', { name: /discount \(\-\)/i }));
    expect(onDiscountChange).toHaveBeenCalledWith(true);
  });
});

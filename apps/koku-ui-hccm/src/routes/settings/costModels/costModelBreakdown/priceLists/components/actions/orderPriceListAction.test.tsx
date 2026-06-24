import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { OrderPriceListAction } from './orderPriceListAction';

jest.mock('../review', () => ({
  ReviewOrderModal: ({ isOpen, onConfirm, onClose }: any) =>
    isOpen ? (
      <div data-testid="review-modal">
        <button type="button" onClick={onConfirm}>
          review-confirm
        </button>
        <button type="button" onClick={onClose}>
          review-close
        </button>
      </div>
    ) : null,
}));

const costModel = { uuid: 'cm-1', name: 'Model' } as any;

describe('OrderPriceListAction', () => {
  test('opens review modal and calls onOrder', () => {
    const onOrder = jest.fn();
    render(
      <IntlProvider locale="en">
        <OrderPriceListAction canWrite costModel={costModel} onOrder={onOrder} />
      </IntlProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /order price lists/i }));
    expect(screen.getByTestId('review-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /review-confirm/i }));
    expect(onOrder).toHaveBeenCalled();
  });
});

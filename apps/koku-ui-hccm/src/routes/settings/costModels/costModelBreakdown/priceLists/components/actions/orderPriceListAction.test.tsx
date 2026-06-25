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

const costModelWithSources = { uuid: 'cm-1', name: 'Model', sources: [{ uuid: 'source-1' }] } as any;
const costModelWithoutSources = { uuid: 'cm-1', name: 'Model' } as any;

describe('OrderPriceListAction', () => {
  test('opens review modal and calls onOrder when cost model has sources', () => {
    const onOrder = jest.fn();
    render(
      <IntlProvider locale="en">
        <OrderPriceListAction canWrite costModel={costModelWithSources} onOrder={onOrder} />
      </IntlProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /order price lists/i }));
    expect(screen.getByTestId('review-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /review-confirm/i }));
    expect(onOrder).toHaveBeenCalled();
  });

  test('calls onOrder directly when cost model has no sources', () => {
    const onOrder = jest.fn();
    render(
      <IntlProvider locale="en">
        <OrderPriceListAction canWrite costModel={costModelWithoutSources} onOrder={onOrder} />
      </IntlProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /order price lists/i }));
    expect(screen.queryByTestId('review-modal')).not.toBeInTheDocument();
    expect(onOrder).toHaveBeenCalled();
  });
});

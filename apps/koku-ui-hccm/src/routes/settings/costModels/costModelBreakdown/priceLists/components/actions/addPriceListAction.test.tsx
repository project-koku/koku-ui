import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { AddPriceListAction } from './addPriceListAction';

jest.mock('../review', () => ({
  ReviewChangeModal: ({ isOpen, onConfirm, onClose }: any) =>
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

jest.mock('../add', () => ({
  AddPriceListModal: ({ isOpen, onAdd, onClose }: any) =>
    isOpen ? (
      <div data-testid="add-modal">
        <button type="button" onClick={() => onAdd([{ uuid: 'pl-1' }])}>
          add-confirm
        </button>
        <button type="button" onClick={onClose}>
          add-close
        </button>
      </div>
    ) : null,
}));

const costModel = { uuid: 'cm-1', name: 'Model' } as any;

describe('AddPriceListAction', () => {
  test('opens review then add modal and calls onAdd', () => {
    const onAdd = jest.fn();
    render(
      <IntlProvider locale="en">
        <AddPriceListAction canWrite costModel={costModel} onAdd={onAdd} />
      </IntlProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /assign price lists/i }));
    expect(screen.getByTestId('review-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /review-confirm/i }));
    expect(screen.getByTestId('add-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /add-confirm/i }));
    expect(onAdd).toHaveBeenCalledWith([{ uuid: 'pl-1' }]);
  });
});

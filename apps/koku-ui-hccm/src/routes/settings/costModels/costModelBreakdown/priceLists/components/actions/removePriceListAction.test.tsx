import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { RemovePriceListAction } from './removePriceListAction';

jest.mock('../remove', () => ({
  RemovePriceListModal: ({ isOpen, onRemove }: any) =>
    isOpen ? (
      <button type="button" onClick={() => onRemove()}>
        remove-confirm
      </button>
    ) : null,
}));

const costModel = { uuid: 'cm-1', name: 'Model' } as any;
const priceList = { uuid: 'pl-1', name: 'Standard' } as any;

describe('RemovePriceListAction', () => {
  test('opens remove modal and calls onRemove', () => {
    const onRemove = jest.fn();
    render(
      <IntlProvider locale="en">
        <RemovePriceListAction canWrite costModel={costModel} onRemove={onRemove} priceList={priceList} />
      </IntlProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /unassign from cost model/i }));
    fireEvent.click(screen.getByRole('button', { name: /remove-confirm/i }));
    expect(onRemove).toHaveBeenCalledWith([priceList]);
  });
});

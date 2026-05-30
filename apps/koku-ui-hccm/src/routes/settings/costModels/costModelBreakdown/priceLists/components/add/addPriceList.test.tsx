import { act, render, screen } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';

import { AddPriceList, type AddPriceListHandle } from './addPriceList';

jest.mock('./addPriceListModal', () => ({
  AddPriceListModal: ({ isOpen, onAdd, onClose }: any) =>
    isOpen ? (
      <div data-testid="add-price-list-modal">
        <button type="button" onClick={() => onAdd([{ uuid: 'pl-1' }])}>
          confirm-add
        </button>
        <button type="button" onClick={onClose}>
          close
        </button>
      </div>
    ) : null,
}));

const costModel = { uuid: 'cm-1', name: 'Model' } as any;

describe('AddPriceList', () => {
  test('open ref shows modal and add invokes onAdd', () => {
    const onAdd = jest.fn();
    const ref = createRef<AddPriceListHandle>();
    render(
      <IntlProvider locale="en">
        <AddPriceList canWrite costModel={costModel} onAdd={onAdd} ref={ref} />
      </IntlProvider>
    );
    act(() => ref.current?.open());
    expect(screen.getByTestId('add-price-list-modal')).toBeInTheDocument();
    act(() => screen.getByRole('button', { name: /confirm-add/i }).click());
    expect(onAdd).toHaveBeenCalledWith([{ uuid: 'pl-1' }]);
  });
});

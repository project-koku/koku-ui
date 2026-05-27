import { act, render, screen } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';

import { RemovePriceList, type RemovePriceListHandle } from './removePriceList';

jest.mock('./removePriceListModal', () => ({
  RemovePriceListModal: ({ isOpen, onRemove, selectedItems }: any) =>
    isOpen ? (
      <button type="button" onClick={() => onRemove(selectedItems)}>
        remove-confirm
      </button>
    ) : null,
}));

const costModel = { uuid: 'cm-1', name: 'Model' } as any;

describe('RemovePriceList', () => {
  test('open ref shows modal and remove invokes onRemove', () => {
    const onRemove = jest.fn();
    const ref = createRef<RemovePriceListHandle>();
    render(
      <IntlProvider locale="en">
        <RemovePriceList costModel={costModel} onRemove={onRemove} ref={ref} selectedItems={[{ uuid: 'pl-1' }]} />
      </IntlProvider>
    );
    act(() => ref.current?.open());
    act(() => screen.getByRole('button', { name: /remove-confirm/i }).click());
    expect(onRemove).toHaveBeenCalledWith([{ uuid: 'pl-1' }]);
  });
});

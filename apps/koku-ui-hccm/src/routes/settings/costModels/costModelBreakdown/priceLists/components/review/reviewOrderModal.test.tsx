import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { ReviewOrderModal } from './reviewOrderModal';

const costModel = { uuid: 'cm-1', name: 'Model' } as any;

describe('ReviewOrderModal', () => {
  test('confirm and close invoke callbacks', () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    render(
      <IntlProvider locale="en">
        <ReviewOrderModal costModel={costModel} isOpen onConfirm={onConfirm} onClose={onClose} />
      </IntlProvider>
    );
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /continue/i }));
    expect(onConfirm).toHaveBeenCalled();
    fireEvent.click(within(dialog).getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });
});

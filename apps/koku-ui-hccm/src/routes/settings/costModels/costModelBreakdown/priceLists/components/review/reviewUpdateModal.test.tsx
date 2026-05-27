import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { ReviewUpdateModal } from './reviewUpdateModal';

const costModel = { uuid: 'cm-1', name: 'Shared Model' } as any;

describe('ReviewUpdateModal', () => {
  test('continue and cancel invoke callbacks', () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    render(
      <IntlProvider locale="en">
        <ReviewUpdateModal costModel={costModel} isOpen onConfirm={onConfirm} onClose={onClose} />
      </IntlProvider>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: /continue/i }));
    expect(onConfirm).toHaveBeenCalled();
    fireEvent.click(within(dialog).getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });
});

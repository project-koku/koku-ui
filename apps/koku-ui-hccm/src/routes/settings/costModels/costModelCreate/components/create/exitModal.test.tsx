import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { ExitModal } from './exitModal';

describe('ExitModal', () => {
  test('open modal shows confirm message and buttons invoke handlers', () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    render(
      <IntlProvider locale="en">
        <ExitModal isOpen onCancel={onCancel} onConfirm={onConfirm} />
      </IntlProvider>
    );

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/stop creating a cost model/i)).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: /yes, i want to exit/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    fireEvent.click(within(dialog).getByRole('button', { name: /no, i want to continue/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

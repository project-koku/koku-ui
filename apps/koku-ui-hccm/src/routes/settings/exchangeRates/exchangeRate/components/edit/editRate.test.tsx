import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';

import messages from '../../../../../../../locales/translations.json';
import type { EditRateHandle } from './editRate';
import { EditRate } from './editRate';

jest.mock('./editRateModal', () => ({
  EditRateModal: ({
    isOpen,
    onClose,
    onEdit,
  }: {
    isOpen?: boolean;
    onClose?: () => void;
    onEdit?: (rate: unknown) => void;
  }) =>
    isOpen ? (
      <div data-testid="edit-rate-modal-open">
        <button type="button" onClick={onClose}>
          modal-close
        </button>
        <button type="button" onClick={() => onEdit?.({ uuid: 'rate-1' })}>
          modal-edit
        </button>
      </div>
    ) : null,
}));

describe('EditRate', () => {
  test('open() shows the edit modal', async () => {
    const ref = createRef<EditRateHandle>();
    render(
      <IntlProvider locale="en" messages={messages}>
        <EditRate ref={ref} settings={[]} uuid="rate-1" />
      </IntlProvider>
    );

    await act(async () => {
      ref.current?.open();
    });

    await waitFor(() => expect(screen.getByTestId('edit-rate-modal-open')).toBeInTheDocument());
  });

  test('close and edit callbacks close the modal', async () => {
    const ref = createRef<EditRateHandle>();
    const onClose = jest.fn();
    const onEdit = jest.fn();
    render(
      <IntlProvider locale="en" messages={messages}>
        <EditRate ref={ref} onClose={onClose} onEdit={onEdit} settings={[]} uuid="rate-1" />
      </IntlProvider>
    );

    await act(async () => {
      ref.current?.open();
    });
    await waitFor(() => expect(screen.getByTestId('edit-rate-modal-open')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /modal-close/i }));
    expect(onClose).toHaveBeenCalled();
    expect(screen.queryByTestId('edit-rate-modal-open')).not.toBeInTheDocument();

    await act(async () => {
      ref.current?.open();
    });
    fireEvent.click(screen.getByRole('button', { name: /modal-edit/i }));
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ uuid: 'rate-1' }));
    expect(screen.queryByTestId('edit-rate-modal-open')).not.toBeInTheDocument();
  });
});

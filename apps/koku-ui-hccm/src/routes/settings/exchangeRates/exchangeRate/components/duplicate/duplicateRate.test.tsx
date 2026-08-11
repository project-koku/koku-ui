import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';

import messages from '../../../../../../../locales/translations.json';
import type { DuplicateRateHandle } from './duplicateRate';
import { DuplicateRate } from './duplicateRate';

jest.mock('./duplicateRateModal', () => ({
  DuplicateRateModal: ({
    isOpen,
    onClose,
    onDuplicate,
  }: {
    isOpen?: boolean;
    onClose?: () => void;
    onDuplicate?: (rate: unknown) => void;
  }) =>
    isOpen ? (
      <div data-testid="duplicate-rate-modal-open">
        <button type="button" onClick={onClose}>
          modal-close
        </button>
        <button type="button" onClick={() => onDuplicate?.({ uuid: 'rate-1' })}>
          modal-duplicate
        </button>
      </div>
    ) : null,
}));

describe('DuplicateRate', () => {
  test('open() shows the duplicate modal', async () => {
    const ref = createRef<DuplicateRateHandle>();
    const onDuplicate = jest.fn();
    render(
      <IntlProvider locale="en" messages={messages}>
        <DuplicateRate ref={ref} onDuplicate={onDuplicate} settings={[]} uuid="rate-1" />
      </IntlProvider>
    );

    await act(async () => {
      ref.current?.open();
    });

    await waitFor(() => expect(screen.getByTestId('duplicate-rate-modal-open')).toBeInTheDocument());
  });

  test('close and duplicate callbacks close the modal', async () => {
    const ref = createRef<DuplicateRateHandle>();
    const onClose = jest.fn();
    const onDuplicate = jest.fn();
    render(
      <IntlProvider locale="en" messages={messages}>
        <DuplicateRate ref={ref} onClose={onClose} onDuplicate={onDuplicate} settings={[]} uuid="rate-1" />
      </IntlProvider>
    );

    await act(async () => {
      ref.current?.open();
    });
    await waitFor(() => expect(screen.getByTestId('duplicate-rate-modal-open')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /modal-close/i }));
    expect(onClose).toHaveBeenCalled();
    expect(screen.queryByTestId('duplicate-rate-modal-open')).not.toBeInTheDocument();

    await act(async () => {
      ref.current?.open();
    });
    fireEvent.click(screen.getByRole('button', { name: /modal-duplicate/i }));
    expect(onDuplicate).toHaveBeenCalledWith(expect.objectContaining({ uuid: 'rate-1' }));
    expect(screen.queryByTestId('duplicate-rate-modal-open')).not.toBeInTheDocument();
  });
});

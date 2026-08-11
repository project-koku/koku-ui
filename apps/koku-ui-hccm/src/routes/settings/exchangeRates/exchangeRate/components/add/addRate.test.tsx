import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import messages from '../../../../../../../locales/translations.json';
import { AddRate } from './addRate';

jest.mock('./addRateModal', () => ({
  AddRateModal: ({
    isOpen,
    onAdd,
    onClose,
  }: {
    isOpen?: boolean;
    onAdd?: (rate: unknown) => void;
    onClose?: () => void;
  }) =>
    isOpen ? (
      <div data-testid="add-rate-modal-open">
        <button type="button" onClick={onClose}>
          modal-close
        </button>
        <button type="button" onClick={() => onAdd?.({ uuid: 'new-rate' })}>
          modal-add
        </button>
      </div>
    ) : null,
}));

describe('AddRate', () => {
  test('opens add modal when create button is clicked', () => {
    render(
      <IntlProvider locale="en" messages={messages}>
        <AddRate canWrite />
      </IntlProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /create exchange rate/i }));
    expect(screen.getByTestId('add-rate-modal-open')).toBeInTheDocument();
  });

  test('disables create button when canWrite is false', () => {
    render(
      <IntlProvider locale="en" messages={messages}>
        <AddRate canWrite={false} />
      </IntlProvider>
    );

    expect(screen.getByRole('button', { name: /create exchange rate/i })).toHaveAttribute('aria-disabled', 'true');
  });

  test('add and close callbacks close the modal', () => {
    const onAdd = jest.fn();
    const onClose = jest.fn();
    render(
      <IntlProvider locale="en" messages={messages}>
        <AddRate canWrite onAdd={onAdd} onClose={onClose} />
      </IntlProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /create exchange rate/i }));
    fireEvent.click(screen.getByRole('button', { name: /modal-add/i }));
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ uuid: 'new-rate' }));
    expect(screen.queryByTestId('add-rate-modal-open')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /create exchange rate/i }));
    fireEvent.click(screen.getByRole('button', { name: /modal-close/i }));
    expect(onClose).toHaveBeenCalled();
    expect(screen.queryByTestId('add-rate-modal-open')).not.toBeInTheDocument();
  });
});

import { act, render, screen } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';

import { DeleteIntegration, type DeleteIntegrationHandle } from './deleteIntegration';

jest.mock('./deleteIntegrationModal', () => ({
  DeleteIntegrationModal: ({ isOpen, onDelete, onClose }: any) =>
    isOpen ? (
      <div data-testid="delete-integration-modal">
        <button type="button" onClick={() => onDelete(['src-1'])}>
          confirm-delete
        </button>
        <button type="button" onClick={onClose}>
          close
        </button>
      </div>
    ) : null,
}));

const costModel = { uuid: 'cm-1', name: 'Model', source_type: 'OpenShift Container Platform' } as any;

describe('DeleteIntegration', () => {
  test('open ref shows modal and delete invokes onDelete', () => {
    const onDelete = jest.fn();
    const ref = createRef<DeleteIntegrationHandle>();
    render(
      <IntlProvider locale="en">
        <DeleteIntegration costModel={costModel} onDelete={onDelete} ref={ref} />
      </IntlProvider>
    );
    act(() => ref.current?.open());
    expect(screen.getByTestId('delete-integration-modal')).toBeInTheDocument();
    act(() => screen.getByRole('button', { name: /confirm-delete/i }).click());
    expect(onDelete).toHaveBeenCalledWith(['src-1']);
  });
});

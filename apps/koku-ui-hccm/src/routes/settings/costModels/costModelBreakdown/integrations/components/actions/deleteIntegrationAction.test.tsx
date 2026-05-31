import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { DeleteIntegrationAction } from './deleteIntegrationAction';

jest.mock('../delete', () => ({
  DeleteIntegrationModal: ({ isOpen, onDelete }: any) =>
    isOpen ? (
      <button type="button" onClick={() => onDelete(['src-1'])}>
        delete-confirm
      </button>
    ) : null,
}));

const costModel = { uuid: 'cm-1', name: 'Model', source_type: 'OpenShift Container Platform' } as any;

describe('DeleteIntegrationAction', () => {
  test('opens delete modal and calls onDelete', () => {
    const onDelete = jest.fn();
    render(
      <IntlProvider locale="en">
        <DeleteIntegrationAction canWrite costModel={costModel} onDelete={onDelete} uuid="src-1" />
      </IntlProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /unassign integration/i }));
    fireEvent.click(screen.getByRole('button', { name: /delete-confirm/i }));
    expect(onDelete).toHaveBeenCalledWith(['src-1']);
  });
});

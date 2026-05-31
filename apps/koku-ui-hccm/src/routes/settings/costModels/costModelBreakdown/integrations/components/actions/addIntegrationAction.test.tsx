import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { AddIntegrationAction } from './addIntegrationAction';

jest.mock('../add', () => ({
  AddIntegrationModal: ({ isOpen, onAdd, onClose }: any) =>
    isOpen ? (
      <div data-testid="add-modal">
        <button type="button" onClick={() => onAdd(['src-1'])}>
          add-confirm
        </button>
        <button type="button" onClick={onClose}>
          add-close
        </button>
      </div>
    ) : null,
}));

const costModel = { uuid: 'cm-1', name: 'Model', source_type: 'OpenShift Container Platform' } as any;

describe('AddIntegrationAction', () => {
  test('opens add modal and calls onAdd', () => {
    const onAdd = jest.fn();
    render(
      <IntlProvider locale="en">
        <AddIntegrationAction canWrite costModel={costModel} onAdd={onAdd} />
      </IntlProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /assign integration/i }));
    fireEvent.click(screen.getByRole('button', { name: /add-confirm/i }));
    expect(onAdd).toHaveBeenCalledWith(['src-1']);
  });
});

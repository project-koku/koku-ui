import { act, render, screen } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';

import { AddIntegration, type AddIntegrationHandle } from './addIntegration';

jest.mock('./addIntegrationModal', () => ({
  AddIntegrationModal: ({ isOpen, onAdd, onClose }: any) =>
    isOpen ? (
      <div data-testid="add-integration-modal">
        <button type="button" onClick={() => onAdd(['src-1'])}>
          confirm-add
        </button>
        <button type="button" onClick={onClose}>
          close
        </button>
      </div>
    ) : null,
}));

const costModel = { uuid: 'cm-1', name: 'Model', source_type: 'OpenShift Container Platform' } as any;

describe('AddIntegration', () => {
  test('open ref shows modal and add invokes onAdd', () => {
    const onAdd = jest.fn();
    const ref = createRef<AddIntegrationHandle>();
    render(
      <IntlProvider locale="en">
        <AddIntegration canWrite costModel={costModel} onAdd={onAdd} ref={ref} />
      </IntlProvider>
    );
    act(() => ref.current?.open());
    expect(screen.getByTestId('add-integration-modal')).toBeInTheDocument();
    act(() => screen.getByRole('button', { name: /confirm-add/i }).click());
    expect(onAdd).toHaveBeenCalledWith(['src-1']);
  });
});

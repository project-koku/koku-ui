import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';

import { EditCostModelContent, type EditCostModelContentHandle } from './editCostModelContent';

const costModel = {
  uuid: 'cm-1',
  name: 'Model',
  description: 'Original',
  currency: 'USD',
  source_type: 'OpenShift Container Platform',
  price_lists: [],
} as any;

describe('EditCostModelContent', () => {
  test('onDisabled true until name or description changes; ref save calls onSave', async () => {
    const onDisabled = jest.fn();
    const onSave = jest.fn();
    const ref = createRef<EditCostModelContentHandle>();

    render(
      <IntlProvider locale="en">
        <EditCostModelContent costModel={costModel} onDisabled={onDisabled} onSave={onSave} ref={ref} />
      </IntlProvider>
    );

    await waitFor(() => expect(onDisabled).toHaveBeenCalledWith(true));

    fireEvent.change(document.getElementById('name') as HTMLInputElement, {
      target: { value: 'Updated Name' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: /description/i }), {
      target: { value: 'New description' },
    });
    await waitFor(() => expect(onDisabled).toHaveBeenLastCalledWith(false));

    act(() => ref.current?.save());

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        uuid: 'cm-1',
        name: 'Updated Name',
        description: 'New description',
        currency: 'USD',
      })
    );
  });
});

import { render, screen, waitFor, act } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';

import type { EditRateHandle } from './editRate';
import { EditRate } from './editRate';

jest.mock('./editRateModal', () => ({
  EditRateModal: ({ isOpen }: { isOpen?: boolean }) => (isOpen ? <div data-testid="edit-rate-modal-open" /> : null),
}));

const settings = [{ code: 'USD', static_rates: [] }];

describe('EditRate', () => {
  test('open() shows edit modal', async () => {
    const ref = createRef<EditRateHandle>();
    render(
      <IntlProvider locale="en">
        <EditRate ref={ref} settings={settings} uuid="rate-1" />
      </IntlProvider>
    );

    await act(async () => {
      ref.current?.open();
    });

    await waitFor(() => expect(screen.getByTestId('edit-rate-modal-open')).toBeInTheDocument());
  });
});

import { act, render, screen, waitFor } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';

import type { DeleteRateHandle } from './deleteRate';
import { DeleteRate } from './deleteRate';

jest.mock('./deleteRateModal', () => ({
  DeleteRateModal: ({ isOpen }: { isOpen?: boolean }) =>
    isOpen ? <div data-testid="delete-rate-modal-open" /> : null,
}));

describe('DeleteRate', () => {
  test('open() shows delete modal', async () => {
    const ref = createRef<DeleteRateHandle>();
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <DeleteRate ref={ref} settings={[] as any} uuid="rate-1" />
      </IntlProvider>
    );
    await act(async () => {
      ref.current?.open();
    });
    await waitFor(() => expect(screen.getByTestId('delete-rate-modal-open')).toBeInTheDocument());
  });
});

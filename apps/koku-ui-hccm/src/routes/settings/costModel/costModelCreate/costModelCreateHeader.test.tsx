import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { CostModelCreateHeader } from './costModelCreateHeader';

describe('CostModelCreateHeader', () => {
  test('cancel and create callbacks', () => {
    const onCancel = jest.fn();
    const onCreate = jest.fn();
    render(
      <MemoryRouter>
        <IntlProvider locale="en">
          <CostModelCreateHeader
          canWrite
          isDisabled={false}
          onCancel={onCancel}
          onCreate={onCreate}
          priceList={{ name: 'New list' } as any}
          />
        </IntlProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(onCancel).toHaveBeenCalled();
    expect(onCreate).toHaveBeenCalled();
  });
});

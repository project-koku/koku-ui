import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { IntegrationContentToolbar } from './integrationContentToolbar';

jest.mock('routes/components/dataToolbar', () => ({
  BasicToolbar: ({ onBulkSelect, onFilterAdded, onFilterRemoved }: any) => (
    <div data-testid="basic-toolbar">
      <button type="button" onClick={() => onBulkSelect?.('page')}>
        bulk-select
      </button>
      <button type="button" onClick={() => onFilterAdded?.({ type: 'name', value: 'x' })}>
        filter-add
      </button>
      <button type="button" onClick={() => onFilterRemoved?.({ type: 'name', value: 'x' })}>
        filter-remove
      </button>
    </div>
  ),
}));

describe('IntegrationContentToolbar', () => {
  test('renders toolbar and invokes callbacks', () => {
    const onBulkSelect = jest.fn();
    const onFilterAdded = jest.fn();
    const onFilterRemoved = jest.fn();

    render(
      <IntlProvider locale="en">
        <IntegrationContentToolbar
          canWrite
          onBulkSelect={onBulkSelect}
          onFilterAdded={onFilterAdded}
          onFilterRemoved={onFilterRemoved}
          selectedItems={[]}
        />
      </IntlProvider>
    );

    expect(screen.getByTestId('basic-toolbar')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /bulk-select/i }));
    fireEvent.click(screen.getByRole('button', { name: /filter-add/i }));
    fireEvent.click(screen.getByRole('button', { name: /filter-remove/i }));
    expect(onBulkSelect).toHaveBeenCalledWith('page');
    expect(onFilterAdded).toHaveBeenCalledWith({ type: 'name', value: 'x' });
    expect(onFilterRemoved).toHaveBeenCalledWith({ type: 'name', value: 'x' });
  });
});

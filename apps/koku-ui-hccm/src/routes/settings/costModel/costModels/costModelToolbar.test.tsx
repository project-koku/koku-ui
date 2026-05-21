import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { CostModelToolbar } from './costModelToolbar';

jest.mock('routes/components/dataToolbar', () => ({
  BasicToolbar: ({ actions, filter, pagination }: any) => (
    <div data-testid="basic-toolbar">
      {actions}
      {filter}
      {pagination}
    </div>
  ),
}));

describe('CostModelToolbar', () => {
  test('create and filter callbacks', () => {
    const onCreate = jest.fn();
    const onFilterAdded = jest.fn();
    const onFilterRemoved = jest.fn();
    render(
      <IntlProvider locale="en">
        <CostModelToolbar
          canWrite
          itemsPerPage={10}
          itemsTotal={1}
          onCreate={onCreate}
          onFilterAdded={onFilterAdded}
          onFilterRemoved={onFilterRemoved}
          pagination={<span data-testid="pagination" />}
        />
      </IntlProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /create cost model/i }));
    expect(onCreate).toHaveBeenCalled();
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { CostModelToolbar } from './costModelToolbar';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

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
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('create navigates to cost model wizard', () => {
    render(
      <MemoryRouter>
        <IntlProvider locale="en">
          <CostModelToolbar
            canWrite
            itemsPerPage={10}
            itemsTotal={1}
            onFilterAdded={jest.fn()}
            onFilterRemoved={jest.fn()}
            pagination={<span data-testid="pagination" />}
          />
        </IntlProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /create cost model/i }));
    expect(mockNavigate).toHaveBeenCalled();
  });
});

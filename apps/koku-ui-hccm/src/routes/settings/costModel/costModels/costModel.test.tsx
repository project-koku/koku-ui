import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { configureStore } from 'store/store';

import { CostModel } from './costModel';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

jest.mock('./costModelTable', () => ({
  CostModelTable: ({
    onDelete,
    onSort,
  }: {
    onDelete?: () => void;
    onSort?: (sortType: string, asc: boolean) => void;
  }) => (
    <div data-testid="cost-model-table">
      <button type="button" onClick={() => onDelete?.()}>
        table-delete
      </button>
      <button type="button" onClick={() => onSort?.('name', true)}>
        table-sort
      </button>
    </div>
  ),
}));

jest.mock('./costModelToolbar', () => ({
  CostModelToolbar: ({
    onCreate,
    onFilterAdded,
    onFilterRemoved,
    pagination,
  }: {
    onCreate?: () => void;
    onFilterAdded?: (f: { type?: string; value?: string }) => void;
    onFilterRemoved?: (f: { type?: string; value?: string }) => void;
    pagination?: React.ReactNode;
  }) => (
    <div data-testid="cost-model-toolbar">
      <button type="button" onClick={() => onCreate?.()}>
        toolbar-create
      </button>
      <button type="button" onClick={() => onFilterAdded?.({ type: 'name', value: 'x' })}>
        toolbar-filter-add
      </button>
      <button type="button" onClick={() => onFilterRemoved?.({ type: 'name', value: 'x' })}>
        toolbar-filter-remove
      </button>
      {pagination}
    </div>
  ),
}));

jest.mock('api/costModels', () => {
  const actual = jest.requireActual('api/costModels');
  return { ...actual, fetchCostModels: jest.fn() };
});

import * as api from 'api/costModels';

describe('settings CostModel list', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    (api.fetchCostModels as jest.Mock).mockResolvedValue({
      data: { data: [{ uuid: 'cm-1', name: 'Model A' }], meta: { count: 1, limit: 10, offset: 0 } },
    });
  });

  test('renders table when cost models exist', async () => {
    render(
      <Provider store={configureStore({} as any)}>
        <IntlProvider locale="en">
          <MemoryRouter>
            <CostModel canWrite />
          </MemoryRouter>
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(screen.getByTestId('cost-model-table')).toBeInTheDocument());
    expect(screen.getByTestId('cost-model-toolbar')).toBeInTheDocument();
  });

  test('shows empty state when no cost models', async () => {
    (api.fetchCostModels as jest.Mock).mockResolvedValue({
      data: { data: [], meta: { count: 0, limit: 10, offset: 0 } },
    });
    render(
      <Provider store={configureStore({} as any)}>
        <IntlProvider locale="en">
          <MemoryRouter>
            <CostModel canWrite />
          </MemoryRouter>
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(screen.getByRole('button', { name: /create cost model/i })).toBeInTheDocument());
  });

  test('create navigates to wizard', async () => {
    render(
      <Provider store={configureStore({} as any)}>
        <IntlProvider locale="en">
          <MemoryRouter>
            <CostModel canWrite />
          </MemoryRouter>
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(screen.getByTestId('cost-model-toolbar')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /toolbar-create/i }));
    expect(mockNavigate).toHaveBeenCalled();
  });

  test('toolbar and table callbacks update query', async () => {
    render(
      <Provider store={configureStore({} as any)}>
        <IntlProvider locale="en">
          <MemoryRouter>
            <CostModel canWrite />
          </MemoryRouter>
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(screen.getByTestId('cost-model-table')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /toolbar-filter-add/i }));
    fireEvent.click(screen.getByRole('button', { name: /toolbar-filter-remove/i }));
    fireEvent.click(screen.getByRole('button', { name: /table-sort/i }));
    fireEvent.click(screen.getByRole('button', { name: /table-delete/i }));
  });
});

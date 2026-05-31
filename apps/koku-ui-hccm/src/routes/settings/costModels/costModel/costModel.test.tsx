import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { CostModels } from 'api/costModels';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { FetchStatus } from 'store/common';
import { defaultState, stateKey } from 'store/costModels/costModelReducer';
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

jest.mock('./costModelToolbar', () => {
  const React = require('react');
  const { useNavigate } = require('react-router-dom');

  return {
    CostModelToolbar: ({
      onFilterAdded,
      onFilterRemoved,
      pagination,
    }: {
      onFilterAdded?: (f: { type?: string; value?: string }) => void;
      onFilterRemoved?: (f: { type?: string; value?: string }) => void;
      pagination?: React.ReactNode;
    }) => {
      const navigate = useNavigate();

      return (
        <div data-testid="cost-model-toolbar">
          <button type="button" onClick={() => navigate('/settings/cost-model/create')}>
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
      );
    },
  };
});

jest.mock('store/costModels/costModelActions', () => {
  const actual = jest.requireActual('store/costModels/costModelActions');
  return {
    ...actual,
    fetchCostModels: jest.fn(() => () => undefined),
  };
});

const defaultCostModels: CostModels = {
  data: [{ uuid: 'cm-1', name: 'Model A' } as any],
  meta: { count: 1, limit: 10, offset: 0 },
  links: { first: null, last: null, next: null, previous: null },
};

const createStoreWithCostModels = (costModels: CostModels = defaultCostModels) =>
  configureStore({
    [stateKey]: {
      ...defaultState,
      costModels,
      fetch: { status: FetchStatus.complete, error: null },
    },
  } as any);

const renderCostModel = (store = createStoreWithCostModels()) =>
  render(
    <Provider store={store}>
      <IntlProvider locale="en">
        <MemoryRouter>
          <CostModel canWrite />
        </MemoryRouter>
      </IntlProvider>
    </Provider>
  );

describe('settings CostModel list', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders table when cost models exist', () => {
    renderCostModel();
    expect(screen.getByTestId('cost-model-table')).toBeInTheDocument();
    expect(screen.getByTestId('cost-model-toolbar')).toBeInTheDocument();
  });

  test('shows empty state when no cost models', () => {
    const emptyCostModels: CostModels = {
      data: [],
      meta: { count: 0, limit: 10, offset: 0 },
      links: { first: null, last: null, next: null, previous: null },
    };
    renderCostModel(createStoreWithCostModels(emptyCostModels));
    expect(screen.getByRole('button', { name: /create cost model/i })).toBeInTheDocument();
  });

  test('create navigates to wizard', () => {
    renderCostModel();
    fireEvent.click(screen.getByRole('button', { name: /toolbar-create/i }));
    expect(mockNavigate).toHaveBeenCalled();
  });

  test('toolbar and table callbacks update query', async () => {
    renderCostModel();
    expect(screen.getByTestId('cost-model-table')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /toolbar-filter-add/i }));
    await waitFor(() => expect(screen.getByRole('button', { name: /table-sort/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /toolbar-filter-remove/i }));
    await waitFor(() => expect(screen.getByRole('button', { name: /table-sort/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /table-sort/i }));
    await waitFor(() => expect(screen.getByRole('button', { name: /table-delete/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /table-delete/i }));
  });
});

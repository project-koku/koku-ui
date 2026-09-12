import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';

import { ResourcePathsType } from 'api/resources/resource';
import { FetchStatus } from 'store/common';
import { resourceActions } from 'store/resources';

import { CostCategoryValue } from './costCategoryValue';

const intl = {
  formatMessage: ({ defaultMessage, id }: { defaultMessage?: string; id?: string }) => defaultMessage ?? id ?? '',
};

const mockResourceState = {
  report: { data: [] as any[] },
  status: FetchStatus.complete as FetchStatus,
};

jest.mock('store/resources', () => ({
  resourceActions: {
    fetchResource: jest.fn(() => ({ type: 'TEST/FETCH_RESOURCE' })),
  },
  resourceSelectors: {
    selectResource: () => mockResourceState.report,
    selectResourceFetchStatus: () => mockResourceState.status,
  },
}));

const renderValue = (props: Record<string, unknown> = {}) =>
  render(
    <Provider store={createStore(() => ({}))}>
      <MemoryRouter>
        <CostCategoryValue
          intl={intl as any}
          onCostCategoryValueSelect={jest.fn()}
          onCostCategoryValueInput={jest.fn()}
          onCostCategoryValueInputChange={jest.fn()}
          costCategoryKey="cost-center"
          costCategoryKeyValue=""
          resourcePathsType={ResourcePathsType.aws}
          {...props}
        />
      </MemoryRouter>
    </Provider>
  );

describe('CostCategoryValue', () => {
  beforeEach(() => {
    mockResourceState.report = { data: [] };
    jest.clearAllMocks();
  });

  test('renders a search input when there are no category values', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onCostCategoryValueInput = jest.fn();
    const onCostCategoryValueInputChange = jest.fn();

    renderValue({ onCostCategoryValueInput, onCostCategoryValueInputChange });

    expect(resourceActions.fetchResource).toHaveBeenCalled();
    const input = screen.getByPlaceholderText(/filter by value/i);
    await user.type(input, 'ops');
    expect(onCostCategoryValueInputChange).toHaveBeenCalled();
    await user.type(input, '{enter}');
    expect(onCostCategoryValueInput).toHaveBeenCalled();
  });

  test('renders a select when category values are available', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockResourceState.report = {
      data: [{ key: 'cost-center', values: ['ops', 'eng'] }],
    };
    const onCostCategoryValueSelect = jest.fn();

    renderValue({ onCostCategoryValueSelect, selections: ['ops'] as any });

    await user.click(screen.getByRole('button', { name: /choose value/i }));
    expect(screen.getByText('ops')).toBeInTheDocument();
    await user.click(screen.getAllByRole('checkbox')[1]);
    expect(onCostCategoryValueSelect).toHaveBeenCalled();
  });
});

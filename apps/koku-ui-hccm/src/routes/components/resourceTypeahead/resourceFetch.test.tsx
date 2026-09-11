import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { ResourcePathsType, ResourceType } from 'api/resources/resource';
import { FetchStatus } from 'store/common';

import { ResourceFetch } from './resourceFetch';

const mockResourceState = {
  resource: {
    data: [
      { value: 'acct-1', account_alias: 'Payments' },
      { value: 'acct-2', account_alias: 'Platform' },
    ],
  } as any,
  status: FetchStatus.complete as FetchStatus,
};

jest.mock('store/resources', () => ({
  resourceActions: {
    fetchResource: jest.fn(() => ({ type: 'TEST/FETCH' })),
  },
  resourceSelectors: {
    selectResource: () => mockResourceState.resource,
    selectResourceFetchStatus: () => mockResourceState.status,
    selectResourceError: () => undefined,
  },
}));

describe('ResourceFetch', () => {
  beforeEach(() => {
    mockResourceState.status = FetchStatus.complete;
  });

  test('renders options and selects a value', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSelect = jest.fn();
    render(
      <Provider store={createStore(() => ({}))}>
        <ResourceFetch
          ariaLabel="Filter by account"
          resourcePathsType={ResourcePathsType.aws}
          resourceType={ResourceType.account}
          resourceKey="account_alias"
          search="pay"
          onSelect={onSelect}
        />
      </Provider>
    );

    await user.click(screen.getByLabelText('Filter by account'));
    expect(screen.getByRole('menuitem', { name: 'Payments' })).toBeInTheDocument();
    await user.click(screen.getByRole('menuitem', { name: 'Payments' }));
    expect(onSelect).toHaveBeenCalled();
  });

  test('does not show options while a fetch is in progress', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockResourceState.status = FetchStatus.inProgress;
    render(
      <Provider store={createStore(() => ({}))}>
        <ResourceFetch
          ariaLabel="Filter by account"
          resourcePathsType={ResourcePathsType.aws}
          resourceType={ResourceType.account}
          search="pay"
        />
      </Provider>
    );

    await user.click(screen.getByLabelText('Filter by account'));
    expect(screen.queryByRole('menuitem', { name: 'acct-1' })).not.toBeInTheDocument();
  });
});

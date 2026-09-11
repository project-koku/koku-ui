import { render, screen } from '@testing-library/react';
import { ResourcePathsType, ResourceType } from 'api/resources/resource';
import React from 'react';
import { FetchStatus } from 'store/common';

import { ResourceFetch } from './resourceFetch';

const mockUseSelector = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => mockUseSelector(),
}));

jest.mock('store/resources', () => ({
  resourceActions: { fetchResource: jest.fn(() => ({ type: 'fetch' })) },
  resourceSelectors: {
    selectResource: jest.fn(),
    selectResourceFetchStatus: jest.fn(),
    selectResourceError: jest.fn(),
  },
}));

jest.mock('./resourceInput', () => ({
  ResourceInput: ({ options, search }: { options?: { key: string }[]; search?: string }) => (
    <div>
      <div data-testid="search">{search}</div>
      <div data-testid="options">{(options || []).map(option => option.key).join(',')}</div>
    </div>
  ),
}));

const mockSelectors = (resource: unknown, status: unknown, error: unknown) => {
  let index = 0;
  const values = [resource, status, error];
  mockUseSelector.mockImplementation(() => values[index++ % 3]);
};

describe('ResourceFetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('maps resource values and aliases that match the search', () => {
    mockSelectors(
      {
        data: [
          { value: 'id-1', account_alias: 'Alias One' },
          { value: 'id-2', account_alias: 'other' },
        ],
      },
      FetchStatus.complete,
      undefined
    );

    render(
      <ResourceFetch
        resourceKey="account_alias"
        resourcePathsType={ResourcePathsType.ocp}
        resourceType={ResourceType.account}
        search="alias"
      />
    );

    expect(screen.getByTestId('options')).toHaveTextContent('Alias One,id-2');
  });

  test('omits options while a fetch is in progress', () => {
    mockSelectors({ data: [{ value: 'id-1' }] }, FetchStatus.inProgress, undefined);
    render(
      <ResourceFetch resourcePathsType={ResourcePathsType.ocp} resourceType={ResourceType.project} search="app" />
    );
    expect(screen.getByTestId('options')).toHaveTextContent('');
  });

  test('dispatches a delayed fetch for a non-empty search', () => {
    mockSelectors(undefined, FetchStatus.complete, undefined);
    render(
      <ResourceFetch resourcePathsType={ResourcePathsType.ocp} resourceType={ResourceType.project} search="app" />
    );
    jest.advanceTimersByTime(625);
    expect(mockDispatch).toHaveBeenCalled();
  });
});

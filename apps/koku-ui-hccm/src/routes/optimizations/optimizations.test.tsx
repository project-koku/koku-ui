jest.mock('api/ros', () => {
  const actual = jest.requireActual('api/ros');
  return {
    __esModule: true,
    ...actual,
    fetchRos: jest.fn(),
  };
});

import { render, screen, waitFor } from '@testing-library/react';
import type { RosData } from 'api/ros';
import { fetchRos, RosType } from 'api/ros';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { FetchStatus } from 'store/common';
import { createMockStoreCreator } from 'store/mockStore';
import { rosReducer, rosSelectors, rosStateKey } from 'store/ros';

import Optimizations from './optimizations';

const fetchRosMock = fetchRos as jest.Mock;

const rosMock: RosData = {
  openapi: '3.0.0',
  info: {
    description: 'ROS OpenAPI',
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0',
    },
    title: 'Resource Optimization',
    version: '1.0.0',
  },
  paths: {},
};

let mockIsEfficiencyToggleEnabled = true;
let mockIsOnPremEnabled = true;

jest.mock('components/featureToggle', () => ({
  get isOnPremEnabled() {
    return mockIsOnPremEnabled;
  },
  useIsEfficiencyToggleEnabled: () => mockIsEfficiencyToggleEnabled,
}));

jest.mock('utils/chrome', () => ({
  withChrome: (Component: React.ComponentType) => Component,
}));

jest.mock('@redhat-cloud-services/frontend-components/AsyncComponent', () => () => (
  <div data-testid="optimizations-title" />
));

jest.mock('./efficiency', () => ({
  Efficiency: () => <div data-testid="efficiency" />,
}));

jest.mock('./optimizationsDetails', () => ({
  OptimizationsDetails: () => <div data-testid="optimizations-details" />,
}));

const createRosStore = createMockStoreCreator({
  [rosStateKey]: rosReducer,
});

const renderOptimizations = (store = createRosStore()) =>
  render(
    <Provider store={store}>
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <IntlProvider locale="en">
          <Optimizations />
        </IntlProvider>
      </MemoryRouter>
    </Provider>
  );

describe('Optimizations ROS availability', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsEfficiencyToggleEnabled = true;
    mockIsOnPremEnabled = true;
    fetchRosMock.mockResolvedValue({ data: rosMock });
  });

  test('fetches the ROS OpenAPI spec on mount', async () => {
    const store = createRosStore();
    renderOptimizations(store);
    expect(fetchRosMock).toHaveBeenCalled();
    await waitFor(() =>
      expect(rosSelectors.selectRosFetchStatus(store.getState(), RosType.openApi, '')).toBe(FetchStatus.complete)
    );
  });

  test('shows the optimizations tab when the OpenAPI spec is available', async () => {
    renderOptimizations();
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Optimizations' })).toBeInTheDocument();
    });
    expect(screen.getByRole('tab', { name: 'Efficiency' })).toBeInTheDocument();
  });

  test('hides the optimizations tab when the OpenAPI spec is missing', async () => {
    const store = createRosStore();
    fetchRosMock.mockRejectedValueOnce({ response: { status: 404 } });
    renderOptimizations(store);
    await waitFor(() => expect(rosSelectors.selectRosAvailable(store.getState(), RosType.openApi, '')).toBe(false));
    expect(screen.queryByRole('tab', { name: 'Optimizations' })).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Efficiency' })).toBeInTheDocument();
    expect(screen.getByTestId('efficiency')).toBeInTheDocument();
    expect(screen.queryByTestId('optimizations-details')).not.toBeInTheDocument();
  });

  test('does not fetch ROS on SaaS and shows the optimizations tab', async () => {
    mockIsOnPremEnabled = false;
    renderOptimizations();
    expect(fetchRosMock).not.toHaveBeenCalled();
    expect(screen.getByRole('tab', { name: 'Optimizations' })).toBeInTheDocument();
  });
});

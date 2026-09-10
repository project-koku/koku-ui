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
import { providersReducer, providersStateKey } from 'store/providers';
import { reportReducer, reportStateKey } from 'store/reports';
import { rosReducer, rosSelectors, rosStateKey } from 'store/ros';

import OcpBreakdown from './ocpBreakdown';

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

let mockIsOnPremEnabled = true;

jest.mock('components/featureToggle', () => ({
  get isOnPremEnabled() {
    return mockIsOnPremEnabled;
  },
}));

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  const React = require('react');
  return {
    __esModule: true,
    ...actual,
    injectIntl: (Comp: any) => (props: any) =>
      React.createElement(Comp, {
        ...props,
        intl: { formatMessage: (m: { defaultMessage?: string; id?: string }) => m.defaultMessage || m.id || '' },
      }),
  };
});

jest.mock('routes/details/components/breakdown', () => ({
  BreakdownBase: (props: { optimizationsComponent?: React.ReactNode }) => (
    <div data-testid="breakdown-base">{props.optimizationsComponent}</div>
  ),
}));

jest.mock('./costOverview', () => ({
  CostOverview: () => null,
}));

jest.mock('./historicalData', () => ({
  HistoricalData: () => null,
}));

jest.mock('./virtualization', () => ({
  Virtualization: () => null,
}));

jest.mock('./optimizations', () => ({
  OcpOptimizations: () => <div data-testid="ocp-optimizations" />,
}));

jest.mock('./clusterInfo', () => ({
  ClusterInfoModal: () => null,
}));

jest.mock('routes/details/components/providerStatus', () => ({
  ProviderBreakdownModal: () => null,
}));

const createStore = createMockStoreCreator({
  [providersStateKey]: providersReducer,
  [reportStateKey]: reportReducer,
  [rosStateKey]: rosReducer,
});

const renderOcpBreakdown = (store = createStore()) =>
  render(
    <Provider store={store}>
      <MemoryRouter
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
        initialEntries={['/openshift/details?group_by[project]=web']}
      >
        <IntlProvider locale="en">
          <OcpBreakdown />
        </IntlProvider>
      </MemoryRouter>
    </Provider>
  );

describe('OcpBreakdown ROS availability', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsOnPremEnabled = true;
    fetchRosMock.mockResolvedValue({ data: rosMock });
  });

  test('fetches the ROS OpenAPI spec on mount for on-prem', async () => {
    const store = createStore();
    renderOcpBreakdown(store);
    expect(fetchRosMock).toHaveBeenCalled();
    await waitFor(() =>
      expect(rosSelectors.selectRosFetchStatus(store.getState(), RosType.openApi, '')).toBe(FetchStatus.complete)
    );
  });

  test('renders the optimizations component when the OpenAPI spec is available', async () => {
    renderOcpBreakdown();
    expect(await screen.findByTestId('ocp-optimizations')).toBeInTheDocument();
  });

  test('omits the optimizations component when the OpenAPI spec is missing', async () => {
    const store = createStore();
    fetchRosMock.mockRejectedValueOnce({ response: { status: 404 } });
    renderOcpBreakdown(store);
    await waitFor(() => expect(rosSelectors.selectRosAvailable(store.getState(), RosType.openApi, '')).toBe(false));
    expect(screen.queryByTestId('ocp-optimizations')).not.toBeInTheDocument();
  });

  test('does not fetch ROS on SaaS and renders the optimizations component', async () => {
    mockIsOnPremEnabled = false;
    renderOcpBreakdown();
    expect(fetchRosMock).not.toHaveBeenCalled();
    expect(screen.getByTestId('ocp-optimizations')).toBeInTheDocument();
  });
});

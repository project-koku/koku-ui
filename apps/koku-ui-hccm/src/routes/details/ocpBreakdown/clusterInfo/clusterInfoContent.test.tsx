import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { FetchStatus } from 'store/common';
import { providersSelectors } from 'store/providers';

import { ClusterInfoContent } from './clusterInfoContent';

let mockIsOnPremEnabled = false;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: (selector: any) => selector({}),
}));

jest.mock('components/featureToggle', () => ({
  get isOnPremEnabled() {
    return mockIsOnPremEnabled;
  },
}));

jest.mock('store/providers', () => ({
  providersSelectors: {
    selectProviders: jest.fn(),
    selectProvidersFetchStatus: jest.fn(),
    selectProvidersError: jest.fn(),
  },
  providersQuery: {},
}));

jest.mock('utils/paths', () => ({
  ...jest.requireActual('utils/paths'),
  getReleasePath: () => '',
}));

jest.mock('routes/details/components/providerStatus/components/sourceLink', () => ({
  SourceLink: () => <div data-testid="source-link" />,
}));

jest.mock('routes/details/ocpBreakdown/clusterInfo/components/cloudIntegration', () => ({
  CloudIntegration: () => <div data-testid="cloud-integration" />,
}));

jest.mock('routes/components/page/notAvailable', () => ({
  NotAvailable: () => <div data-testid="not-available" />,
}));

jest.mock('routes/components/state/loadingState', () => ({
  LoadingState: () => <div data-testid="loading" />,
}));

const clusterProvider = {
  uuid: 'ocp-uuid',
  name: 'OCP Cluster',
  source_type: 'OCP',
  authentication: { credentials: { cluster_id: 'cluster-1' } },
  additional_context: { operator_version: '1.0.0', operator_update_available: false },
  cost_models: [{ uuid: 'cm-1', name: 'Default' }],
  infrastructure: { uuid: 'cloud-uuid' },
};

const cloudProvider = {
  uuid: 'cloud-uuid',
  name: 'AWS',
  source_type: 'AWS',
};

const providers = { data: [clusterProvider, cloudProvider], meta: { count: 2 } };

const renderContent = (clusterId = 'cluster-1') =>
  render(
    <IntlProvider locale="en">
      <ClusterInfoContent clusterId={clusterId} />
    </IntlProvider>
  );

describe('ClusterInfoContent', () => {
  beforeEach(() => {
    mockIsOnPremEnabled = false;
    jest.clearAllMocks();
    (providersSelectors.selectProviders as jest.Mock).mockReturnValue(providers);
    (providersSelectors.selectProvidersFetchStatus as jest.Mock).mockReturnValue(FetchStatus.complete);
    (providersSelectors.selectProvidersError as jest.Mock).mockReturnValue(null);
  });

  test('shows not available when providers fail to load', () => {
    (providersSelectors.selectProvidersError as jest.Mock).mockReturnValue(new Error('API unavailable'));

    renderContent();

    expect(screen.getByTestId('not-available')).toBeInTheDocument();
  });

  test('shows a loading state while providers are in progress', () => {
    (providersSelectors.selectProvidersFetchStatus as jest.Mock).mockReturnValue(FetchStatus.inProgress);

    renderContent();

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  test('shows the OpenShift cluster details link when on-prem is disabled', () => {
    renderContent();

    expect(screen.getByRole('link', { name: /openshift cluster details/i })).toHaveAttribute(
      'href',
      '/openshift/details/cluster-1'
    );
  });

  test('hides the OpenShift cluster details link when on-prem is enabled', () => {
    mockIsOnPremEnabled = true;

    renderContent();

    expect(screen.queryByRole('link', { name: /openshift cluster details/i })).not.toBeInTheDocument();
    expect(screen.getByText('cluster-1')).toBeInTheDocument();
  });

  test('renders operator version, cost model, and cloud integration for a matching cluster', () => {
    renderContent();

    expect(screen.getByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('Up to date')).toBeInTheDocument();
    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByTestId('source-link')).toBeInTheDocument();
    expect(screen.getByTestId('cloud-integration')).toBeInTheDocument();
  });

  test('renders assign cost model when the cluster has no cost models', () => {
    (providersSelectors.selectProviders as jest.Mock).mockReturnValue({
      data: [{ ...clusterProvider, cost_models: [] }, cloudProvider],
      meta: { count: 2 },
    });

    renderContent();

    expect(screen.getByRole('link', { name: /assign cost model/i })).toBeInTheDocument();
  });

  test('omits Red Hat integration when no matching cluster provider exists', () => {
    renderContent('unknown-cluster');

    expect(screen.queryByText(/red hat integration/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId('source-link')).not.toBeInTheDocument();
  });
});

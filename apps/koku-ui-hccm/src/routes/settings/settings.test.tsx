import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccessType } from 'api/userAccess';
import { FetchStatus } from 'store/common';
import { configureStore } from 'store/store';
import { userAccessQuery, userAccessStateKey } from 'store/userAccess';
import { getFetchId } from 'store/userAccess/userAccessCommon';

import Settings, { getIdKeyForTab, SettingsTab } from './settings';

let mockIsOnPremEnabled = false;
let mockIsOnpremSourcesEnabled = true;

jest.mock('components/featureToggle', () => ({
  get isOnPremEnabled() {
    return mockIsOnPremEnabled;
  },
  get isOnpremSourcesEnabled() {
    return mockIsOnpremSourcesEnabled;
  },
  useIsExchangeRateToggleEnabled: () => false,
}));

jest.mock('utils/chrome', () => ({
  withChrome: (Component: React.ComponentType) => Component,
}));

jest.mock('@scalprum/react-core', () => ({
  ScalprumComponent: ({ scope, module }: { scope?: string; module?: string }) => (
    <div data-testid="sources" data-scope={scope} data-module={module} />
  ),
}));

jest.mock('routes/components/page/notAuthorized', () => ({
  NotAuthorized: () => <div data-testid="not-authorized" />,
}));

jest.mock('./costCategory', () => ({
  CostCategory: () => <div data-testid="cost-category" />,
}));

jest.mock('./costModels', () => ({
  CostModel: () => <div data-testid="cost-model" />,
}));

jest.mock('./display', () => ({
  Display: () => <div data-testid="display" />,
}));

jest.mock('./exchangeRates', () => ({
  ExchangeRate: () => <div data-testid="exchange-rate" />,
}));

jest.mock('./priceLists', () => ({
  PriceList: () => <div data-testid="price-list" />,
}));

jest.mock('./calculations', () => ({
  Calculations: () => <div data-testid="calculations" />,
}));

jest.mock('./platformProjects', () => ({
  PlatformProjects: () => <div data-testid="platform-projects" />,
}));

jest.mock('./tagLabels', () => ({
  TagLabels: () => <div data-testid="tag-labels" />,
}));

const userAccessQueryString = getUserAccessQuery(userAccessQuery);
const userAccessFetchId = getFetchId(UserAccessType.all, userAccessQueryString);

describe('Settings', () => {
  beforeEach(() => {
    mockIsOnPremEnabled = false;
    mockIsOnpremSourcesEnabled = true;
  });

  const defaultUserAccessData = [
    { type: UserAccessType.costModel, access: true, write: true },
    { type: UserAccessType.settings, access: true, write: true },
  ];

  const renderSettings = (
    userAccessData: any[] = defaultUserAccessData,
    { initialEntries, routePath }: { initialEntries?: any[]; routePath?: string } = {}
  ) => {
    const store = configureStore({
      [userAccessStateKey]: {
        byId: new Map([
          [
            userAccessFetchId,
            {
              data: userAccessData,
            },
          ],
        ]),
        errors: new Map([[userAccessFetchId, null]]),
        fetchStatus: new Map([[userAccessFetchId, FetchStatus.complete]]),
      },
    } as any);

    const page = routePath ? (
      <Routes>
        <Route path={routePath} element={<Settings />} />
      </Routes>
    ) : (
      <Settings />
    );

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries ?? ['/']}>
          <IntlProvider locale="en">{page}</IntlProvider>
        </MemoryRouter>
      </Provider>
    );
  };

  test('renders the cost categories tab when on-prem is disabled', () => {
    renderSettings();
    expect(screen.getByRole('tab', { name: /cost categories/i })).toBeInTheDocument();
  });

  test('hides the cost categories tab when on-prem is enabled', () => {
    mockIsOnPremEnabled = true;
    renderSettings();
    expect(screen.queryByRole('tab', { name: /cost categories/i })).not.toBeInTheDocument();
  });

  test('renders the federated sources UI in the Integrations tab by default', async () => {
    mockIsOnPremEnabled = true;
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderSettings([{ type: UserAccessType.sources, access: true, write: true }], {
      initialEntries: ['/openshift/cost-management/settings'],
      routePath: '/openshift/cost-management/settings/*',
    });

    await user.click(screen.getByRole('tab', { name: /integrations/i }));

    const sources = await screen.findByTestId('sources');
    expect(sources).toHaveAttribute('data-scope', 'sources-ui-onprem');
    expect(sources).toHaveAttribute('data-module', './RootApp');
    expect(screen.queryByTestId('not-authorized')).not.toBeInTheDocument();
  });

  test('renders koku-ui-sources in the Integrations tab when the sources UI env is false', async () => {
    mockIsOnPremEnabled = true;
    mockIsOnpremSourcesEnabled = false;
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderSettings([{ type: UserAccessType.sources, access: true, write: true }]);

    await user.click(screen.getByRole('tab', { name: /integrations/i }));

    const sources = await screen.findByTestId('sources');
    expect(sources).toHaveAttribute('data-scope', 'koku-ui-sources');
    expect(sources).toHaveAttribute('data-module', './SourcesPage');
  });

  test('denies the Integrations tab for a user with settings access but no sources access', async () => {
    mockIsOnPremEnabled = true;
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderSettings([{ type: UserAccessType.settings, access: true, write: true }]);

    await user.click(screen.getByRole('tab', { name: /integrations/i }));

    expect(await screen.findByTestId('not-authorized')).toBeInTheDocument();
    expect(screen.queryByTestId('sources')).not.toBeInTheDocument();
  });

  test('selects the Integrations tab from settingsState.activeTab', async () => {
    mockIsOnPremEnabled = true;
    renderSettings(
      [
        { type: UserAccessType.settings, access: true, write: true },
        { type: UserAccessType.sources, access: true, write: true },
      ],
      {
        initialEntries: [
          {
            pathname: '/openshift/cost-management/settings',
            state: { settingsState: { activeTab: SettingsTab.sources } },
          },
        ],
        routePath: '/openshift/cost-management/settings/*',
      }
    );

    const sources = await screen.findByTestId('sources');
    expect(sources).toHaveAttribute('data-scope', 'sources-ui-onprem');
    expect(screen.queryByTestId('display')).not.toBeInTheDocument();
  });

  test('opens integration detail as a full page without Settings tabs', async () => {
    mockIsOnPremEnabled = true;
    renderSettings([{ type: UserAccessType.sources, access: true, write: true }], {
      initialEntries: ['/openshift/cost-management/settings/integrations/detail/src-uuid'],
      routePath: '/openshift/cost-management/settings/*',
    });

    const sources = await screen.findByTestId('sources');
    expect(sources).toHaveAttribute('data-scope', 'sources-ui-onprem');
    expect(sources).toHaveAttribute('data-module', './RootApp');
    expect(screen.queryByRole('heading', { name: /settings/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /integrations/i })).not.toBeInTheDocument();
  });

  test('denies integration detail without sources access', async () => {
    mockIsOnPremEnabled = true;
    renderSettings([{ type: UserAccessType.settings, access: true, write: true }], {
      initialEntries: ['/openshift/cost-management/settings/integrations/detail/src-uuid'],
      routePath: '/openshift/cost-management/settings/*',
    });

    expect(await screen.findByTestId('not-authorized')).toBeInTheDocument();
    expect(screen.queryByTestId('sources')).not.toBeInTheDocument();
  });

  test('selects the Price list tab from settingsState.activeTab', async () => {
    renderSettings(defaultUserAccessData, {
      initialEntries: [
        {
          pathname: '/',
          state: { settingsState: { activeTab: SettingsTab.priceList } },
        },
      ],
    });

    expect(await screen.findByTestId('price-list')).toBeInTheDocument();
    expect(screen.queryByTestId('cost-model')).not.toBeInTheDocument();
  });

  test.each([
    [SettingsTab.costModels, 'cost_models'],
    [SettingsTab.calculations, 'calculations'],
    [SettingsTab.costCategory, 'cost_category'],
    [SettingsTab.display, 'display'],
    [SettingsTab.exchangeRates, 'exchange_rates'],
    [SettingsTab.platformProjects, 'platform_projects'],
    [SettingsTab.priceList, 'price_list'],
    [SettingsTab.tags, 'tags'],
    [SettingsTab.sources, 'sources'],
  ])('getIdKeyForTab(%s) returns %s', (tab, expected) => {
    expect(getIdKeyForTab(tab)).toBe(expected);
  });
});

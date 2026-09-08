import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccessType } from 'api/userAccess';
import { FetchStatus } from 'store/common';
import { configureStore } from 'store/store';
import { userAccessQuery, userAccessStateKey } from 'store/userAccess';
import { getFetchId } from 'store/userAccess/userAccessCommon';

import Settings from './settings';

let mockIsOnPremEnabled = false;

jest.mock('components/featureToggle', () => ({
  get isOnPremEnabled() {
    return mockIsOnPremEnabled;
  },
  useIsDisplayToggleEnabled: () => true,
  useIsExchangeRateToggleEnabled: () => false,
  useIsPriceListToggleEnabled: () => false,
}));

jest.mock('utils/chrome', () => ({
  withChrome: (Component: React.ComponentType) => Component,
}));

jest.mock('@scalprum/react-core', () => ({
  ScalprumComponent: () => <div data-testid="sources" />,
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

jest.mock('./costModelsDeprecated', () => ({
  CostModelsDetails: () => <div data-testid="cost-models-details" />,
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
  });

  const defaultUserAccessData = [
    { type: UserAccessType.costModel, access: true, write: true },
    { type: UserAccessType.settings, access: true, write: true },
  ];

  const renderSettings = (userAccessData: any[] = defaultUserAccessData) => {
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

    return render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <Settings />
          </IntlProvider>
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

  test('renders the Integrations tab content for a user with sources access but no settings access', async () => {
    mockIsOnPremEnabled = true;
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderSettings([{ type: UserAccessType.sources, access: true, write: true }]);

    await user.click(screen.getByRole('tab', { name: /integrations/i }));

    expect(await screen.findByTestId('sources')).toBeInTheDocument();
    expect(screen.queryByTestId('not-authorized')).not.toBeInTheDocument();
  });

  test('denies the Integrations tab for a user with settings access but no sources access', async () => {
    mockIsOnPremEnabled = true;
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderSettings([{ type: UserAccessType.settings, access: true, write: true }]);

    await user.click(screen.getByRole('tab', { name: /integrations/i }));

    expect(await screen.findByTestId('not-authorized')).toBeInTheDocument();
    expect(screen.queryByTestId('sources')).not.toBeInTheDocument();
  });
});

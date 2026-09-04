import { render, screen } from '@testing-library/react';
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

  const renderSettings = () => {
    const store = configureStore({
      [userAccessStateKey]: {
        byId: new Map([
          [
            userAccessFetchId,
            {
              data: [
                { type: UserAccessType.costModel, access: true, write: true },
                { type: UserAccessType.settings, access: true, write: true },
              ],
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
});

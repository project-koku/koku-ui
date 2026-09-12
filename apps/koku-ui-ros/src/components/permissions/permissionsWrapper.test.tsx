import { render, screen } from '@testing-library/react';
import React from 'react';
import { FetchStatus } from 'store/common';

const mockFetchAccountSettings = jest.fn();
const mockFetchProviders = jest.fn();
const mockFetchUserAccess = jest.fn();
const mockResetState = jest.fn();

jest.mock('components/async', () => ({
  asyncComponent: () =>
    ({ children }: { children: React.ReactNode }) => <div data-testid="permissions">{children}</div>,
}));

jest.mock('components/pageTitle', () => ({
  PageTitle: ({ children }: { children: React.ReactNode }) => <div data-testid="page-title">{children}</div>,
}));

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    injectIntl: (Component: React.ComponentType) => (props: object) => <Component {...props} intl={{}} />,
  };
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  connect:
    (mapStateToProps: (state: unknown) => object, mapDispatchToProps: object) =>
    (Component: React.ComponentType) =>
    (props: object) =>
      (
        <Component
          {...props}
          {...mapStateToProps({})}
          {...mapDispatchToProps}
        />
      ),
}));

jest.mock('store/accountSettings', () => ({
  accountSettingsActions: {
    fetchAccountSettings: (...args: unknown[]) => mockFetchAccountSettings(...args),
  },
  accountSettingsSelectors: {
    selectAccountSettings: () => ({}),
    selectAccountSettingsError: () => undefined,
    selectAccountSettingsStatus: () => FetchStatus.complete,
  },
}));

jest.mock('store/providers', () => ({
  providersActions: {
    fetchProviders: (...args: unknown[]) => mockFetchProviders(...args),
  },
  providersQuery: {},
  providersSelectors: {
    selectProviders: () => ({}),
    selectProvidersError: () => undefined,
    selectProvidersFetchStatus: () => FetchStatus.complete,
  },
}));

jest.mock('store/ui', () => ({
  uiActions: {
    resetState: (...args: unknown[]) => mockResetState(...args),
  },
}));

jest.mock('store/userAccess', () => ({
  userAccessActions: {
    fetchUserAccess: (...args: unknown[]) => mockFetchUserAccess(...args),
  },
  userAccessQuery: {},
  userAccessSelectors: {
    selectUserAccess: () => ({}),
    selectUserAccessError: () => undefined,
    selectUserAccessFetchStatus: () => FetchStatus.complete,
  },
}));

import PermissionsWrapper from './permissionsWrapper';

describe('PermissionsWrapper', () => {
  test('fetches access data on mount and renders children when complete', () => {
    render(
      <PermissionsWrapper>
        <div>ready</div>
      </PermissionsWrapper>
    );

    expect(mockResetState).toHaveBeenCalled();
    expect(mockFetchUserAccess).toHaveBeenCalled();
    expect(mockFetchProviders).toHaveBeenCalled();
    expect(mockFetchAccountSettings).toHaveBeenCalled();
    expect(screen.getByTestId('page-title')).toBeInTheDocument();
    expect(screen.getByText('ready')).toBeInTheDocument();
  });
});

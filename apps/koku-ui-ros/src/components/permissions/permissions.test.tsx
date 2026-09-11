import { render, screen } from '@testing-library/react';
import React from 'react';
import { FetchStatus } from 'store/common';
import { routes } from 'routes';
import { formatPath } from 'utils/paths';

const mockUsePathname = jest.fn();
const mockHasRosAccess = jest.fn();
const mockSelectUserAccess = jest.fn();
const mockSelectUserAccessError = jest.fn();
const mockSelectUserAccessFetchStatus = jest.fn();

jest.mock('utils/chrome', () => ({
  withChrome: (Component: React.ComponentType) => Component,
}));

jest.mock('utils/paths', () => ({
  ...jest.requireActual('utils/paths'),
  usePathname: () => mockUsePathname(),
}));

jest.mock('utils/userAccess', () => ({
  hasRosAccess: (...args: unknown[]) => mockHasRosAccess(...args),
}));

jest.mock('store/userAccess', () => ({
  userAccessQuery: { type: 'any' },
  userAccessSelectors: {
    selectUserAccess: (...args: unknown[]) => mockSelectUserAccess(...args),
    selectUserAccessError: (...args: unknown[]) => mockSelectUserAccessError(...args),
    selectUserAccessFetchStatus: (...args: unknown[]) => mockSelectUserAccessFetchStatus(...args),
  },
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  connect:
    (mapStateToProps: (state: unknown, props: unknown) => object) =>
    (Component: React.ComponentType) =>
    (props: object) => <Component {...props} {...mapStateToProps({}, props)} />,
}));

jest.mock('routes/components/page/loading', () => ({
  Loading: () => <div>loading</div>,
}));

jest.mock('routes/components/page/notAuthorized', () => ({
  NotAuthorized: () => <div>not-authorized</div>,
}));

jest.mock('routes/components/page/notAvailable', () => ({
  NotAvailable: () => <div>not-available</div>,
}));

import Permissions from './permissions';

describe('Permissions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue(formatPath(routes.welcome.path));
    mockHasRosAccess.mockReturnValue(true);
    mockSelectUserAccess.mockReturnValue({ data: true });
    mockSelectUserAccessError.mockReturnValue(undefined);
    mockSelectUserAccessFetchStatus.mockReturnValue(FetchStatus.complete);
  });

  test('renders children when the user has ROS access', () => {
    render(
      <Permissions>
        <div>allowed</div>
      </Permissions>
    );

    expect(screen.getByText('allowed')).toBeInTheDocument();
  });

  test('renders loading while user access is in progress', () => {
    mockSelectUserAccessFetchStatus.mockReturnValue(FetchStatus.inProgress);

    render(
      <Permissions>
        <div>allowed</div>
      </Permissions>
    );

    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  test('renders not available when user access fails', () => {
    mockSelectUserAccessError.mockReturnValue(new Error('boom'));

    render(
      <Permissions>
        <div>allowed</div>
      </Permissions>
    );

    expect(screen.getByText('not-available')).toBeInTheDocument();
  });

  test('renders not authorized when ROS access is missing', () => {
    mockHasRosAccess.mockReturnValue(false);

    render(
      <Permissions>
        <div>allowed</div>
      </Permissions>
    );

    expect(screen.getByText('not-authorized')).toBeInTheDocument();
  });

  test('renders not authorized for unknown paths', () => {
    mockUsePathname.mockReturnValue('/unknown');

    render(
      <Permissions>
        <div>allowed</div>
      </Permissions>
    );

    expect(screen.getByText('not-authorized')).toBeInTheDocument();
  });
});

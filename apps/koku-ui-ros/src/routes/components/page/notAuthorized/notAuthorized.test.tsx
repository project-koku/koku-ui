import { render, screen } from '@testing-library/react';
import React from 'react';
import { routes } from 'routes';
import { formatPath } from 'utils/paths';

import { NotAuthorized } from './notAuthorized';
import { NotAuthorizedState } from './notAuthorizedState';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  const intl = {
    formatMessage: (message: { defaultMessage?: string }) => message?.defaultMessage ?? '',
  };
  return {
    ...actual,
    injectIntl: (Component: React.ComponentType<any>) => (props: object) => <Component intl={intl} {...props} />,
    useIntl: () => intl,
  };
});

describe('NotAuthorized', () => {
  test('renders unauthorized access without a title', () => {
    render(<NotAuthorized pathname={formatPath(routes.welcome.path)} />);
    expect(screen.getByText(/You do not have access to Cost Management ROS/)).toBeInTheDocument();
  });

  test('renders a title when provided', () => {
    render(<NotAuthorized title="Access denied" pathname="/unknown" />);
    expect(screen.getByRole('heading', { name: 'Access denied' })).toBeInTheDocument();
  });
});

describe('NotAuthorizedState', () => {
  test('uses the cost management service name', () => {
    render(<NotAuthorizedState pathname={formatPath(routes.optimizationsDetails.path)} />);
    expect(screen.getByText(/You do not have access to Cost Management ROS/)).toBeInTheDocument();
  });
});

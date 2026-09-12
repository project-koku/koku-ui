import { render } from '@testing-library/react';
import React from 'react';
import { routes } from 'routes';
import { formatPath } from 'utils/paths';

import PageTitle from './pageTitle';

const mockUsePathname = jest.fn();

jest.mock('utils/paths', () => ({
  ...jest.requireActual('utils/paths'),
  usePathname: () => mockUsePathname(),
}));

const intl = {
  formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
};

describe('PageTitle', () => {
  test('sets the optimizations page title', () => {
    mockUsePathname.mockReturnValue(formatPath(routes.optimizationsDetails.path));
    render(<PageTitle intl={intl as any}>child</PageTitle>);
    expect(document.title).toBe('Optimizations - Cost Management | OpenShift');
  });

  test('sets the default page title for unknown paths', () => {
    mockUsePathname.mockReturnValue('/unknown');
    render(<PageTitle intl={intl as any}>child</PageTitle>);
    expect(document.title).toBe('Cost Management ROS | OpenShift');
  });
});

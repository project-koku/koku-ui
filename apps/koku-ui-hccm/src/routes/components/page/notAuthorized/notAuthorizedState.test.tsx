import { render, screen } from '@testing-library/react';
import React from 'react';

import { routes } from 'routes';
import { formatPath } from 'utils/paths';

import { NotAuthorizedState } from './notAuthorizedState';

const intl = {
  formatMessage: ({ defaultMessage, id }: { defaultMessage?: string; id?: string }) => defaultMessage ?? id ?? '',
};

describe('NotAuthorizedState', () => {
  test.each([
    [formatPath(routes.awsDetails.path), 'Amazon Web Services'],
    [formatPath(routes.awsBreakdown.path), 'Amazon Web Services'],
    [formatPath(routes.azureDetails.path), 'Microsoft Azure'],
    [formatPath(routes.azureBreakdown.path), 'Microsoft Azure'],
    [formatPath(routes.gcpDetails.path), 'Google Cloud'],
    [formatPath(routes.gcpBreakdown.path), 'Google Cloud'],
    [formatPath(routes.ocpDetails.path), 'OpenShift'],
    [formatPath(routes.ocpBreakdown.path), 'OpenShift'],
    [formatPath(routes.settings.path), 'settings'],
    [formatPath(routes.explorer.path), 'Cost management'],
    [formatPath(routes.optimizations.path), 'Optimizations'],
    [formatPath(routes.optimizationsBreakdown.path), 'Optimizations'],
    [formatPath(routes.costModelCreate.path), 'cost models'],
    [formatPath(routes.costModelBreakdown.basePath), 'cost models'],
    [formatPath(routes.priceListCreate.path), 'price lists'],
    [formatPath(routes.priceListBreakdown.basePath), 'price lists'],
    ['/unknown', 'Cost management'],
  ])('renders an unauthorized message for %s', (pathname, expected) => {
    render(<NotAuthorizedState intl={intl as any} pathname={pathname} />);
    expect(screen.getByText(new RegExp(expected, 'i'))).toBeInTheDocument();
  });
});

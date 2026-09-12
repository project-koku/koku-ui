import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { routes, Routes } from './routes';

jest.mock('components/userAccess', () => ({
  __esModule: true,
  userAccess: (Component: React.ComponentType) => Component,
}));

jest.mock('@koku-ui/ui-lib/components/page/notFound', () => () => <div>not-found</div>);
jest.mock('./routes/staging/optimizations/ocpOptimizationsStaging', () => () => <div>ocp-optimizations</div>);
jest.mock('./routes/staging/optimizations/ocpOptimizationsBreakdownStaging', () => () => (
  <div>ocp-optimizations-breakdown</div>
));
jest.mock('./routes/staging/optimizations/optimizationsBadgeStaging', () => () => <div>optimizations-badge</div>);
jest.mock('./routes/staging/optimizations/optimizationsContainersTableStaging', () => () => (
  <div>optimizations-containers</div>
));
jest.mock('./routes/staging/optimizations/optimizationsDetailsStaging', () => () => <div>optimizations-details</div>);
jest.mock('./routes/staging/optimizations/optimizationsDetailsBreakdownStaging', () => () => (
  <div>optimizations-details-breakdown</div>
));
jest.mock('./routes/staging/optimizations/optimizationsLinkStaging', () => () => <div>optimizations-link</div>);
jest.mock('./routes/staging/optimizations/optimizationsProjectsTableStaging', () => () => (
  <div>optimizations-projects</div>
));
jest.mock('./routes/staging/optimizations/optimizationsSummaryStaging', () => () => <div>optimizations-summary</div>);
jest.mock('routes/components/page/welcome/welcome', () => () => <div>welcome</div>);

describe('App routes', () => {
  test('route definitions have a path and element', () => {
    Object.values(routes).forEach(definition => {
      expect(definition.path).toBeTruthy();
      expect(definition.element).toBeTruthy();
    });
    expect(routes.welcome.path).toBe('/');
    expect(routes.optimizationsDetails.path).toBe('/optimizations/details');
  });

  test('renders the welcome route', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes />
      </MemoryRouter>
    );

    expect(await screen.findByText('welcome')).toBeInTheDocument();
  });

  test('renders the wildcard not-found route', async () => {
    render(
      <MemoryRouter initialEntries={['/missing']}>
        <Routes />
      </MemoryRouter>
    );

    expect(await screen.findByText('not-found')).toBeInTheDocument();
  });

  test.each([
    ['/optimizations/ocp', 'ocp-optimizations'],
    ['/optimizations/ocp/breakdown', 'ocp-optimizations-breakdown'],
    ['/optimizations/badge', 'optimizations-badge'],
    ['/optimizations/table/containers', 'optimizations-containers'],
    ['/optimizations/details', 'optimizations-details'],
    ['/optimizations/details/breakdown', 'optimizations-details-breakdown'],
    ['/optimizations/link', 'optimizations-link'],
    ['/optimizations/table/projects', 'optimizations-projects'],
    ['/optimizations/summary', 'optimizations-summary'],
  ])('renders %s', async (path, label) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes />
      </MemoryRouter>
    );
    expect(await screen.findByText(label)).toBeInTheDocument();
  });
});

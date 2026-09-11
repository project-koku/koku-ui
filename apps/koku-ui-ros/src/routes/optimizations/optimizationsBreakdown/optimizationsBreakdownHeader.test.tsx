import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { OptimizationsBreakdownHeader } from './optimizationsBreakdownHeader';

jest.mock('utils/dates', () => ({
  getTimeFromNow: () => '2 days ago',
}));

jest.mock('utils/notifications', () => ({
  hasNotificationsWarning: () => true,
}));

jest.mock('./optimizationsBreakdownProjectLink', () => ({
  OptimizationsBreakdownProjectLink: ({ project }: { project?: string }) => <span>{project}</span>,
}));

jest.mock('./optimizationsBreakdownToolbar', () => ({
  OptimizationsBreakdownToolbar: () => <div data-testid="toolbar" />,
}));

const report = {
  cluster_alias: 'cluster-alias',
  cluster_uuid: 'uuid',
  container: 'container-1',
  last_reported: '2024-01-01',
  project: 'app',
  workload: 'deploy',
  workload_type: 'deployment',
  recommendations: {},
};

describe('OptimizationsBreakdownHeader', () => {
  test('renders a breadcrumb, warning, and container details', () => {
    render(
      <MemoryRouter>
        <OptimizationsBreakdownHeader
          breadcrumbLabel="Back"
          breadcrumbPath="/details"
          isContainers
          report={report as any}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/details');
    expect(screen.getByRole('heading', { name: 'container-1' })).toBeInTheDocument();
    expect(screen.getByText('app')).toBeInTheDocument();
    expect(screen.getByText('deploy')).toBeInTheDocument();
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
  });

  test('falls back to a generated breadcrumb path', () => {
    render(
      <MemoryRouter initialEntries={['/optimizations/details/breakdown']}>
        <OptimizationsBreakdownHeader report={{ project: 'app' } as any} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Back to optimizations' })).toHaveAttribute(
      'href',
      '/optimizations/details'
    );
    expect(screen.getByRole('heading', { name: 'app' })).toBeInTheDocument();
  });
});

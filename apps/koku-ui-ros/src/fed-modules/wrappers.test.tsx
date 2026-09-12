import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('./optimizationsWrapper', () => ({
  OptimizationsWrapper: ({ children }: { children: React.ReactNode }) => <div data-testid="wrapper">{children}</div>,
}));

jest.mock('routes/optimizations/optimizationsBadge', () => ({
  OptimizationsBadge: ({ cluster, project }: { cluster?: string; project?: string }) => (
    <div data-testid="badge">{`${cluster || ''}:${project || ''}`}</div>
  ),
}));

jest.mock('routes/optimizations/optimizationsLink', () => ({
  OptimizationsLink: ({ cluster, linkPath }: { cluster?: string; linkPath?: string }) => (
    <div data-testid="link">{`${cluster}:${linkPath}`}</div>
  ),
}));

jest.mock('routes/optimizations/optimizationsSummary', () => ({
  OptimizationsSummary: ({ linkPath }: { linkPath?: string }) => <div data-testid="summary">{linkPath}</div>,
}));

jest.mock('routes/optimizations/optimizationsDetails', () => ({
  OptimizationsDetails: ({ queryStateName }: { queryStateName: string }) => (
    <div data-testid="details">{queryStateName}</div>
  ),
  OptimizationsDetailsTitle: () => <div data-testid="details-title" />,
}));

jest.mock('routes/optimizations/optimizationsBreakdown', () => ({
  OptimizationsBreakdown: ({ queryStateName }: { queryStateName: string }) => (
    <div data-testid="breakdown">{queryStateName}</div>
  ),
}));

jest.mock('routes/optimizations/optimizationsTable', () => ({
  OptimizationsTable: ({ queryStateName }: { queryStateName: string }) => (
    <div data-testid="table">{queryStateName}</div>
  ),
  OptimizationsContainersTable: ({ queryStateName }: { queryStateName: string }) => (
    <div data-testid="containers">{queryStateName}</div>
  ),
  OptimizationsProjectsTable: ({ queryStateName }: { queryStateName: string }) => (
    <div data-testid="projects">{queryStateName}</div>
  ),
}));

jest.mock('routes/optimizations/optimizationsOcpBreakdown', () => ({
  OptimizationsOcpBreakdown: ({ queryStateName }: { queryStateName: string }) => (
    <div data-testid="ocp-breakdown">{queryStateName}</div>
  ),
}));

import OptimizationsBadgeWrapper from './optimizationsBadgeWrapper';
import OptimizationsBreakdownWrapper from './optimizationsBreakdownWrapper';
import OptimizationsContainersTableWrapper from './optimizationsContainersTableWrapper';
import OptimizationsDetailsTitleWrapper from './optimizationsDetailsTitleWrapper';
import OptimizationsDetailsWrapper from './optimizationsDetailsWrapper';
import OptimizationsLinkWrapper from './optimizationsLinkWrapper';
import OptimizationsOcpBreakdownWrapper from './optimizationsOcpBreakdownWrapper';
import OptimizationsProjectsTableWrapper from './optimizationsProjectsTableWrapper';
import OptimizationsSummaryWrapper from './optimizationsSummaryWrapper';
import OptimizationsTableWrapper from './optimizationsTableWrapper';

describe('fed-module wrappers', () => {
  test('OptimizationsBadgeWrapper', () => {
    render(<OptimizationsBadgeWrapper cluster="c1" project="p1" />);
    expect(screen.getByTestId('badge')).toHaveTextContent('c1:p1');
  });

  test('OptimizationsLinkWrapper', () => {
    render(<OptimizationsLinkWrapper cluster="c1" linkPath="/path" />);
    expect(screen.getByTestId('link')).toHaveTextContent('c1:/path');
  });

  test('OptimizationsSummaryWrapper', () => {
    render(<OptimizationsSummaryWrapper linkPath="/summary" />);
    expect(screen.getByTestId('summary')).toHaveTextContent('/summary');
  });

  test('OptimizationsDetailsWrapper', () => {
    render(<OptimizationsDetailsWrapper queryStateName="details" />);
    expect(screen.getByTestId('details')).toHaveTextContent('details');
  });

  test('OptimizationsDetailsTitleWrapper', () => {
    render(<OptimizationsDetailsTitleWrapper />);
    expect(screen.getByTestId('details-title')).toBeInTheDocument();
  });

  test('OptimizationsBreakdownWrapper', () => {
    render(<OptimizationsBreakdownWrapper queryStateName="breakdown" />);
    expect(screen.getByTestId('breakdown')).toHaveTextContent('breakdown');
  });

  test('OptimizationsTableWrapper', () => {
    render(<OptimizationsTableWrapper queryStateName="table" />);
    expect(screen.getByTestId('table')).toHaveTextContent('table');
  });

  test('OptimizationsContainersTableWrapper', () => {
    render(<OptimizationsContainersTableWrapper queryStateName="containers" />);
    expect(screen.getByTestId('containers')).toHaveTextContent('containers');
  });

  test('OptimizationsProjectsTableWrapper', () => {
    render(<OptimizationsProjectsTableWrapper queryStateName="projects" />);
    expect(screen.getByTestId('projects')).toHaveTextContent('projects');
  });

  test('OptimizationsOcpBreakdownWrapper', () => {
    render(<OptimizationsOcpBreakdownWrapper queryStateName="ocp" />);
    expect(screen.getByTestId('ocp-breakdown')).toHaveTextContent('ocp');
  });
});

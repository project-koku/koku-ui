import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('routes/optimizations/optimizationsBadge', () => ({
  OptimizationsBadge: () => <div data-testid="badge" />,
}));
jest.mock('routes/optimizations/optimizationsLink', () => ({
  OptimizationsLink: () => <div data-testid="link" />,
}));
jest.mock('routes/optimizations/optimizationsSummary', () => ({
  OptimizationsSummary: () => <div data-testid="summary" />,
}));
jest.mock('routes/optimizations/optimizationsDetails', () => ({
  OptimizationsDetails: () => <div data-testid="details" />,
  OptimizationsBreakdown: undefined,
}));
jest.mock('routes/optimizations/optimizationsBreakdown', () => ({
  OptimizationsBreakdown: () => <div data-testid="breakdown" />,
}));
jest.mock('routes/optimizations/optimizationsTable', () => ({
  OptimizationsContainersTable: () => <div data-testid="containers" />,
  OptimizationsProjectsTable: () => <div data-testid="projects" />,
}));
jest.mock('routes/optimizations/optimizationsOcpBreakdown', () => ({
  OptimizationsOcpBreakdown: () => <div data-testid="ocp-breakdown" />,
}));

import OptimizationsBadgeStaging from './optimizationsBadgeStaging';
import OptimizationsLinkStaging from './optimizationsLinkStaging';
import OptimizationsSummaryStaging from './optimizationsSummaryStaging';
import OptimizationsDetailsStaging from './optimizationsDetailsStaging';
import OptimizationsDetailsBreakdownStaging from './optimizationsDetailsBreakdownStaging';
import OptimizationsContainersTableStaging from './optimizationsContainersTableStaging';
import OptimizationsProjectsTableStaging from './optimizationsProjectsTableStaging';
import OcpOptimizationsBreakdownStaging from './ocpOptimizationsBreakdownStaging';

describe('staging optimizations pages', () => {
  const wrap = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

  test('badge staging', () => {
    wrap(<OptimizationsBadgeStaging />);
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });

  test('link staging', () => {
    wrap(<OptimizationsLinkStaging />);
    expect(screen.getByTestId('link')).toBeInTheDocument();
  });

  test('summary staging', () => {
    wrap(<OptimizationsSummaryStaging />);
    expect(screen.getByTestId('summary')).toBeInTheDocument();
  });

  test('details staging', () => {
    wrap(<OptimizationsDetailsStaging />);
    expect(screen.getByTestId('details')).toBeInTheDocument();
  });

  test('details breakdown staging', () => {
    wrap(<OptimizationsDetailsBreakdownStaging />);
    expect(screen.getByTestId('breakdown')).toBeInTheDocument();
  });

  test('containers table staging', () => {
    wrap(<OptimizationsContainersTableStaging />);
    expect(screen.getByTestId('containers')).toBeInTheDocument();
  });

  test('projects table staging', () => {
    wrap(<OptimizationsProjectsTableStaging />);
    expect(screen.getByTestId('projects')).toBeInTheDocument();
  });

  test('ocp breakdown staging', () => {
    wrap(<OcpOptimizationsBreakdownStaging />);
    expect(screen.getByTestId('breakdown')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import OptimizationsOcpBreakdown from './optimizationsOcpBreakdown';

jest.mock('routes/optimizations/optimizationsTable', () => ({
  OptimizationsContainersTable: () => <div data-testid="containers" />,
  OptimizationsProjectsTable: () => <div data-testid="projects" />,
}));

jest.mock('./optimizationsOcpBreakdownToolbar', () => ({
  OptimizationsOcpBreakdownToolbar: () => <div data-testid="toolbar" />,
}));

describe('OptimizationsOcpBreakdown', () => {
  test('renders projects and containers tables', () => {
    render(
      <MemoryRouter>
        <OptimizationsOcpBreakdown queryStateName="ocp" project="app" />
      </MemoryRouter>
    );

    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('projects')).toBeInTheDocument();
    expect(screen.getByTestId('containers')).toBeInTheDocument();
  });
});

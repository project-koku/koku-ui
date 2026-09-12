import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { RosNamespace } from 'api/ros/ros';

import OptimizationsDetails from './optimizationsDetails';

let mockIsNamespaceToggleEnabled = false;

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ state: {} }),
}));

jest.mock('components/featureToggle', () => ({
  useIsNamespaceToggleEnabled: () => mockIsNamespaceToggleEnabled,
}));

jest.mock('routes/optimizations/optimizationsTable', () => ({
  OptimizationsTable: () => <div data-testid="legacy-table" />,
  OptimizationsContainersTable: () => <div data-testid="containers-table" />,
  OptimizationsProjectsTable: () => <div data-testid="projects-table" />,
}));

jest.mock('./optimizationsDetailsToolbar', () => ({
  OptimizationsDetailsToolbar: ({ onNamespaceSelect }: { onNamespaceSelect: (value: RosNamespace) => void }) => (
    <button type="button" onClick={() => onNamespaceSelect(RosNamespace.containers)}>
      switch-namespace
    </button>
  ),
}));

describe('OptimizationsDetails', () => {
  beforeEach(() => {
    mockIsNamespaceToggleEnabled = false;
  });

  test('renders the legacy table when the namespace toggle is off', () => {
    render(<OptimizationsDetails queryStateName="details" />);
    expect(screen.getByTestId('legacy-table')).toBeInTheDocument();
  });

  test('renders projects by default and can switch to containers', async () => {
    mockIsNamespaceToggleEnabled = true;
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<OptimizationsDetails queryStateName="details" />);

    expect(screen.getByTestId('projects-table')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'switch-namespace' }));
    expect(screen.getByTestId('containers-table')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import React from 'react';

import { OptimizationsDetailsTitle } from './optimizationsDetailsTitle';

let mockIsNamespaceToggleEnabled = false;

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: () => ({
      formatMessage: (message: { defaultMessage?: string }) => message?.defaultMessage ?? '',
    }),
  };
});

jest.mock('components/featureToggle', () => ({
  useIsNamespaceToggleEnabled: () => mockIsNamespaceToggleEnabled,
}));

describe('OptimizationsDetailsTitle', () => {
  beforeEach(() => {
    mockIsNamespaceToggleEnabled = false;
  });

  test('renders the title without a description when the namespace toggle is off', () => {
    render(<OptimizationsDetailsTitle />);
    expect(screen.getByRole('heading', { name: /Optimizations/ })).toBeInTheDocument();
  });

  test('renders a description when the namespace toggle is on', () => {
    mockIsNamespaceToggleEnabled = true;
    render(<OptimizationsDetailsTitle />);
    expect(screen.getByRole('heading', { name: /Optimizations/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'A dialog with a description of optimizations' })).toBeInTheDocument();
    expect(
      screen.getByText('Get detailed recommendations for how to optimize your Red Hat OpenShift cost and performance.')
    ).toBeInTheDocument();
  });
});

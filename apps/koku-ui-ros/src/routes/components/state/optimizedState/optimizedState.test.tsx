import { render, screen } from '@testing-library/react';
import React from 'react';

import OptimizedState from './optimizedState';

const intl = {
  formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
};

describe('OptimizedState', () => {
  test('renders default copy', () => {
    render(<OptimizedState intl={intl as any} />);
    expect(screen.getByRole('heading', { name: 'You have reached recommended state!' })).toBeInTheDocument();
    expect(screen.getByText('Good job optimizing the current configuration.')).toBeInTheDocument();
  });

  test('renders custom copy', () => {
    render(<OptimizedState intl={intl as any} heading="Optimized" body="All set" />);
    expect(screen.getByRole('heading', { name: 'Optimized' })).toBeInTheDocument();
    expect(screen.getByText('All set')).toBeInTheDocument();
  });
});

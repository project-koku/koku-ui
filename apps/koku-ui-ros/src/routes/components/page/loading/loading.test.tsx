import { render, screen } from '@testing-library/react';
import React from 'react';

import Loading from './loading';

jest.mock('routes/components/state/loadingState', () => ({
  LoadingState: ({ body, heading }: { body?: string; heading?: string }) => (
    <div>
      <div>{heading || 'looking'}</div>
      <div>{body || 'searching'}</div>
    </div>
  ),
}));

describe('Loading', () => {
  test('renders without a title', () => {
    render(<Loading />);
    expect(screen.getByText('looking')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  test('renders a title and custom copy', () => {
    render(<Loading title="Loading page" heading="Please wait" body="Almost done" />);
    expect(screen.getByRole('heading', { name: 'Loading page' })).toBeInTheDocument();
    expect(screen.getByText('Please wait')).toBeInTheDocument();
    expect(screen.getByText('Almost done')).toBeInTheDocument();
  });
});

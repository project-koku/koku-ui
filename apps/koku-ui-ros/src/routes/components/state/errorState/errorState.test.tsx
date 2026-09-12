import { render, screen } from '@testing-library/react';
import React from 'react';

import ErrorState from './errorState';

const intl = {
  formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
};

describe('ErrorState', () => {
  test('renders an unexpected error', () => {
    render(<ErrorState intl={intl as any} error={undefined as any} />);
    expect(screen.getByRole('heading', { name: 'Oops!' })).toBeInTheDocument();
    expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
  });

  test('renders an unauthorized error', () => {
    render(
      <ErrorState
        intl={intl as any}
        error={{ response: { status: 403 } } as any}
      />
    );
    expect(screen.getByRole('heading', { name: "You don't have access to the Cost management application" })).toBeInTheDocument();
  });

  test('renders an unauthorized error for 401', () => {
    render(
      <ErrorState
        intl={intl as any}
        error={{ response: { status: 401 } } as any}
      />
    );
    expect(screen.getByText(/contact the cost management administrator/i)).toBeInTheDocument();
  });
});

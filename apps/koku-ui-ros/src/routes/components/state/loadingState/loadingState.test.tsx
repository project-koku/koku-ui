import { render, screen } from '@testing-library/react';
import React from 'react';

import LoadingState from './loadingState';

const intl = {
  formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
};

describe('LoadingState', () => {
  test('renders default copy', () => {
    render(<LoadingState intl={intl as any} />);
    expect(screen.getByRole('heading', { name: 'Looking for sources...' })).toBeInTheDocument();
    expect(screen.getByText('Searching for your sources. Do not refresh the browser')).toBeInTheDocument();
  });

  test('renders custom copy', () => {
    render(<LoadingState intl={intl as any} heading="Wait" body="Still loading" />);
    expect(screen.getByRole('heading', { name: 'Wait' })).toBeInTheDocument();
    expect(screen.getByText('Still loading')).toBeInTheDocument();
  });
});

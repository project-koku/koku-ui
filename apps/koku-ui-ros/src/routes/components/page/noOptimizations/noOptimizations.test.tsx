import { render, screen } from '@testing-library/react';
import React from 'react';

import NoOptimizations from './noOptimizations';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  const intl = {
    formatMessage: (message: { defaultMessage?: string }) => message?.defaultMessage ?? '',
  };
  return {
    ...actual,
    injectIntl: (Component: React.ComponentType<any>) => (props: object) => <Component intl={intl} {...props} />,
    useIntl: () => intl,
  };
});

describe('NoOptimizations', () => {
  test('renders the empty optimizations state', () => {
    render(<NoOptimizations />);
    expect(screen.getByRole('heading', { name: 'No optimizations available' })).toBeInTheDocument();
  });

  test('renders a title when provided', () => {
    render(<NoOptimizations title="Optimizations" />);
    expect(screen.getByRole('heading', { name: 'Optimizations' })).toBeInTheDocument();
  });
});

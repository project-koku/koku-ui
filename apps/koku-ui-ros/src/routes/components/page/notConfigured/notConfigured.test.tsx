import { render, screen } from '@testing-library/react';
import React from 'react';

import NotConfigured from './notConfigured';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  const intl = {
    formatMessage: (
      message: { defaultMessage?: string },
      values?: { clipboard?: React.ReactNode; learnMore?: React.ReactNode }
    ) => {
      if (values?.clipboard || values?.learnMore) {
        return (
          <>
            {message?.defaultMessage}
            {values.clipboard}
            {values.learnMore}
          </>
        );
      }
      return message?.defaultMessage ?? '';
    },
  };
  return {
    ...actual,
    injectIntl: (Component: React.ComponentType<any>) => (props: object) => <Component intl={intl} {...props} />,
    useIntl: () => intl,
  };
});

describe('NotConfigured', () => {
  test('renders configuration guidance', () => {
    render(<NotConfigured />);
    expect(screen.getByRole('heading', { name: 'Optimizations may not be configured' })).toBeInTheDocument();
    expect(screen.getByText(/enable each namespace/i)).toBeInTheDocument();
  });

  test('renders a title when provided', () => {
    render(<NotConfigured title="Setup required" />);
    expect(screen.getByRole('heading', { name: 'Setup required' })).toBeInTheDocument();
  });
});

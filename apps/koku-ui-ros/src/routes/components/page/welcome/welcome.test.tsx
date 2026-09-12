import { render, screen } from '@testing-library/react';
import React from 'react';

import Welcome from './welcome';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  const intl = {
    formatMessage: (message: { defaultMessage?: string }, values?: { url?: React.ReactNode }) => {
      const text = message?.defaultMessage ?? '';
      if (!values?.url) {
        return text;
      }
      const [before] = text.split('{url}');
      return (
        <>
          {before}
          {values.url}
        </>
      );
    },
  };
  return {
    ...actual,
    injectIntl: (Component: React.ComponentType<any>) => (props: object) => <Component intl={intl} {...props} />,
    useIntl: () => intl,
  };
});

describe('Welcome', () => {
  test('renders the welcome empty state', () => {
    render(<Welcome />);
    expect(screen.getByRole('heading', { name: 'Cost Management ROS UI' })).toBeInTheDocument();
  });

  test('renders a title when provided', () => {
    render(<Welcome title="Welcome" />);
    expect(screen.getByRole('heading', { name: 'Welcome' })).toBeInTheDocument();
  });
});

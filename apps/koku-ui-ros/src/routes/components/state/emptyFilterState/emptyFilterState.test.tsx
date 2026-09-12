import { act, render, screen } from '@testing-library/react';
import React from 'react';

import EmptyFilterState from './emptyFilterState';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  const intl = {
    formatMessage: (message: { defaultMessage?: string; id?: string }) => message?.defaultMessage || message?.id || '',
  };
  return {
    ...actual,
    injectIntl: (Component: React.ComponentType<any>) => (props: object) => <Component intl={intl} {...props} />,
    useIntl: () => intl,
  };
});

const mockLocation = { search: '' };

jest.mock('react-router-dom', () => ({
  __esModule: true,
  useLocation: () => mockLocation,
}));

describe('EmptyFilterState', () => {
  test('renders the default empty filter copy', () => {
    render(<EmptyFilterState />);
    expect(screen.getByRole('heading', { name: 'No match found' })).toBeInTheDocument();
    expect(screen.getByText('Sorry, no data with the given filter was found.')).toBeInTheDocument();
  });

  test('renders item1 when the filter is redhat', () => {
    const { container } = render(<EmptyFilterState filter={window.atob('cmVkaGF0')} />);
    expect(container.querySelector('img')).toBeTruthy();
  });

  test('renders the scroll state when the filter is koku', () => {
    jest.useFakeTimers();
    const { container } = render(<EmptyFilterState filter={window.atob('a29rdQ==')} />);
    expect(container.querySelector('img')).toBeTruthy();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(container.querySelector('img')).toBeTruthy();
    jest.useRealTimers();
  });

  test('uses a custom icon when there is no easter-egg match', () => {
    const CustomIcon = () => <span data-testid="custom-icon" />;
    render(<EmptyFilterState filter="nomatch" icon={CustomIcon as any} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  test('reads easter-egg filters from group_by query values', () => {
    mockLocation.search = `?group_by[project]=${window.atob('cmVkaGF0')}`;
    const { container } = render(<EmptyFilterState />);
    expect(container.querySelector('img')).toBeTruthy();
    mockLocation.search = '';
  });

  test('reads easter-egg filters from group_by arrays', () => {
    mockLocation.search = `?group_by[project]=app&group_by[project]=${window.atob('a29rdQ==')}`;
    const { container } = render(<EmptyFilterState />);
    expect(container.querySelector('img')).toBeTruthy();
    mockLocation.search = '';
  });
});

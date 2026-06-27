import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Interval, OptimizationType } from 'utils/commonTypes';

import { data } from '../optimizationsBreakdown/data';
import { OptimizationsBreakdownToolbar } from './optimizationsBreakdownToolbar';

jest.mock('routes/components/perspective/perspectiveSelect', () => ({
  PerspectiveSelect: ({ currentItem, isDisabled, onSelect, options }: any) => (
    <div>
      <span data-testid="current-interval">{currentItem}</span>
      {options.map((option: any) => (
        <button
          key={option.value}
          disabled={option.isDisabled || isDisabled}
          type="button"
          onClick={() => onSelect?.(option.value)}
        >
          {option.value}
        </button>
      ))}
    </div>
  ),
}));

const recommendations = data.data[0].recommendations;

describe('OptimizationsBreakdownToolbar', () => {
  test('renders the current interval and enables intervals with recommendations', () => {
    render(
      <IntlProvider locale="en">
        <OptimizationsBreakdownToolbar
          currentInterval={Interval.medium_term}
          optimizationType={OptimizationType.cost}
          recommendations={recommendations}
        />
      </IntlProvider>
    );

    expect(screen.getByTestId('current-interval')).toHaveTextContent(Interval.medium_term);
    expect(screen.getByRole('button', { name: Interval.short_term })).toBeEnabled();
    expect(screen.getByRole('button', { name: Interval.medium_term })).toBeEnabled();
    expect(screen.getByRole('button', { name: Interval.long_term })).toBeEnabled();
  });

  test('calls onSelect when an enabled interval is chosen', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSelect = jest.fn();

    render(
      <IntlProvider locale="en">
        <OptimizationsBreakdownToolbar
          currentInterval={Interval.short_term}
          onSelect={onSelect}
          optimizationType={OptimizationType.cost}
          recommendations={recommendations}
        />
      </IntlProvider>
    );

    await user.click(screen.getByRole('button', { name: Interval.medium_term }));
    expect(onSelect).toHaveBeenCalledWith(Interval.medium_term);
  });
});

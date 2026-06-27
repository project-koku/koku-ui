import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Interval, OptimizationType } from 'utils/commonTypes';

import { OptimizationsOcpBreakdownToolbar } from './optimizationsOcpBreakdownToolbar';

jest.mock('routes/components/perspective/perspectiveSelect', () => ({
  PerspectiveSelect: ({ currentItem, onSelect, options }: any) => (
    <div>
      <span data-testid={`current-${currentItem}`}>{currentItem}</span>
      {options.map((option: any) => (
        <button key={option.value} type="button" onClick={() => onSelect?.(option.value)}>
          {option.value}
        </button>
      ))}
    </div>
  ),
}));

describe('OptimizationsOcpBreakdownToolbar', () => {
  test('fires interval and optimization type handlers', () => {
    const onIntervalSelect = jest.fn();
    const onOptimizationTypeSelect = jest.fn();

    render(
      <IntlProvider locale="en">
        <OptimizationsOcpBreakdownToolbar
          currentInterval={Interval.short_term}
          onIntervalSelect={onIntervalSelect}
          onOptimizationTypeSelect={onOptimizationTypeSelect}
          optimizationType={OptimizationType.performance}
        />
      </IntlProvider>
    );

    expect(screen.getByTestId(`current-${Interval.short_term}`)).toBeInTheDocument();
    expect(screen.getByTestId(`current-${OptimizationType.performance}`)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: OptimizationType.cost }));
    expect(onOptimizationTypeSelect).toHaveBeenCalledWith(OptimizationType.cost);

    fireEvent.click(screen.getByRole('button', { name: Interval.medium_term }));
    expect(onIntervalSelect).toHaveBeenCalledWith(Interval.medium_term);
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { RosNamespace } from 'api/ros/ros';
import { Interval, OptimizationType } from 'utils/commonTypes';

import { OptimizationsDetailsToolbar } from './optimizationsDetailsToolbar';

jest.mock('routes/components/perspective/perspectiveSelect', () => ({
  PerspectiveSelect: ({ currentItem, onSelect, options, title }: any) => (
    <div data-testid={title?.id || title?.defaultMessage?.[0] || 'perspective-select'}>
      <span data-testid={`current-${currentItem}`}>{currentItem}</span>
      {options.map((option: any) => (
        <button key={option.value} type="button" onClick={() => onSelect?.(option.value)}>
          {option.value}
        </button>
      ))}
    </div>
  ),
}));

describe('OptimizationsDetailsToolbar', () => {
  test('renders namespace toggle and fires selection handlers', () => {
    const onIntervalSelect = jest.fn();
    const onNamespaceSelect = jest.fn();
    const onOptimizationTypeSelect = jest.fn();

    render(
      <IntlProvider locale="en">
        <OptimizationsDetailsToolbar
          interval={Interval.medium_term}
          namespace={RosNamespace.projects}
          onIntervalSelect={onIntervalSelect}
          onNamespaceSelect={onNamespaceSelect}
          onOptimizationTypeSelect={onOptimizationTypeSelect}
          optimizationType={OptimizationType.performance}
        />
      </IntlProvider>
    );

    expect(screen.getByRole('button', { name: 'Projects' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Containers' }));
    expect(onNamespaceSelect).toHaveBeenCalledWith(RosNamespace.containers);

    fireEvent.click(screen.getByRole('button', { name: OptimizationType.cost }));
    expect(onOptimizationTypeSelect).toHaveBeenCalledWith(OptimizationType.cost);

    fireEvent.click(screen.getByRole('button', { name: Interval.long_term }));
    expect(onIntervalSelect).toHaveBeenCalledWith(Interval.long_term);
  });
});

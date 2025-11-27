import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ChartComparison } from './chartComparison';

// Top-level mock to capture props and simulate selection
let lastProps: any;
jest.mock('routes/components/selectWrapper', () => ({
  __esModule: true,
  SelectWrapper: (props: any) => {
    lastProps = props;
    return <button onClick={() => props.onSelect(null, { value: 'opt2' })}>select</button>;
  },
}));

describe('overview/components/ChartComparison', () => {
  beforeEach(() => {
    lastProps = undefined;
    jest.clearAllMocks();
  });

  test('invokes onItemClicked when selection changes', () => {
    const onItemClicked = jest.fn();
    const options = [
      { label: 'Daily', value: 'opt1' },
      { label: 'Cumulative', value: 'opt2', default: true },
    ];

    render(<ChartComparison onItemClicked={onItemClicked} options={options} />);

    // Trigger selection via click so React Testing Library wraps setState in act
    fireEvent.click(screen.getByRole('button', { name: /select/i }));
    expect(onItemClicked).toHaveBeenCalledWith('opt2');

    // Ensure options prop was passed to the wrapper
    expect(lastProps.options).toHaveLength(2);
  });
}); 
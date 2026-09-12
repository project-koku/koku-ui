import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { ResourceInput } from './resourceInput';

describe('ResourceInput', () => {
  test('selects a suggestion and clears the search', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSelect = jest.fn();
    const onClear = jest.fn();
    const onChange = jest.fn();

    render(
      <ResourceInput
        ariaLabel="Filter by name"
        options={[{ key: 'payments' }, { key: 'platform' }] as any}
        onChange={onChange}
        onClear={onClear}
        onSelect={onSelect}
        placeholder="Filter by name"
        search="pay"
      />
    );

    const input = screen.getByLabelText('Filter by name');
    await user.click(input);
    await user.click(screen.getByRole('menuitem', { name: 'payments' }));
    expect(onSelect).toHaveBeenCalled();

    await user.click(input);
    await user.click(screen.getByRole('button', { name: /clear/i }));
    expect(onClear).toHaveBeenCalled();
  });

  test('shows no results when there are no options', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<ResourceInput ariaLabel="Filter by name" options={[]} placeholder="Filter" search="zzz" />);
    await user.click(screen.getByLabelText('Filter by name'));
    expect(screen.getByText(/no results/i)).toBeInTheDocument();
  });
});

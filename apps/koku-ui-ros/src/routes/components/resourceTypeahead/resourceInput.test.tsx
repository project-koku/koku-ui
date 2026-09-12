import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { ResourceInput } from './resourceInput';

describe('ResourceInput', () => {
  test('opens suggestions and selects a value', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSelect = jest.fn();
    const onChange = jest.fn();
    const onClear = jest.fn();

    render(
      <ResourceInput
        ariaLabel="resource search"
        onChange={onChange}
        onClear={onClear}
        onSelect={onSelect}
        options={[
          { key: 'alpha', name: 'alpha' },
          { key: 'beta', name: 'beta' },
        ]}
        placeholder="Search"
        search="al"
      />
    );

    const input = screen.getByLabelText('resource search');
    await user.click(input);
    expect(screen.getByText('Suggestions')).toBeInTheDocument();
    expect(screen.getByText('alpha')).toBeInTheDocument();
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('al');
  });

  test('shows no results and clears search', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onClear = jest.fn();
    render(
      <ResourceInput
        ariaLabel="resource search"
        onClear={onClear}
        options={[]}
        placeholder="Search"
        search="missing"
      />
    );
    await user.click(screen.getByLabelText('resource search'));
    expect(screen.getByText('No results found')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear button and input' }));
    expect(onClear).toHaveBeenCalled();
  });

  test('selects the current search on enter', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSelect = jest.fn();
    render(
      <ResourceInput ariaLabel="resource search" onSelect={onSelect} options={[]} placeholder="Search" search="typed" />
    );
    const input = screen.getByLabelText('resource search');
    await user.click(input);
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('typed');
  });
});

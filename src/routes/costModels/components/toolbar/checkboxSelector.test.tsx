import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { CheckboxSelector } from './checkboxSelector';

test('checkbox selector', async () => {
  const setSelections = jest.fn();
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  render(
    <CheckboxSelector
      options={[
        { label: 'CPU', value: 'cpu' },
        { label: 'Memory', value: 'memory' },
        { label: 'Storage', value: 'storage' },
      ]}
      placeholderText={'Resources'}
      setSelections={setSelections}
      selections={[]}
    />
  );
  expect(screen.queryAllByText('Resources').length).toBe(1);
  expect(screen.queryAllByText('CPU').length).toBe(0);
  expect(screen.queryAllByText('Memory').length).toBe(0);
  expect(screen.queryAllByText('Storage').length).toBe(0);
  await user.click(screen.getByRole('button'));
  expect(screen.queryAllByText('CPU').length).toBe(1);
  expect(screen.queryAllByText('Memory').length).toBe(1);
  expect(screen.queryAllByText('Storage').length).toBe(1);
  expect(setSelections.mock.calls.length).toBe(0);
  await user.click(screen.getAllByRole('checkbox')[0]);
  expect(setSelections.mock.calls).toEqual([['cpu']]);
});

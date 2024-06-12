import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { SelectWrapper } from './index';

test('primary selector', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  const handleOnSelect = jest.fn();
  const selectOptions = [
    { toString: () => 'CPU', value: 'cpu' },
    { toString: () => 'Memory', value: 'memory' },
    { toString: () => 'Storage', value: 'storage' },
  ];
  render(
    <SelectWrapper
      onSelect={(_evt, selection) => handleOnSelect(selection.value)}
      options={selectOptions}
      placeholder={'Resources'}
      selection={selectOptions[0]}
    />
  );
  expect(screen.queryAllByText('CPU').length).toBe(1);
  expect(screen.queryAllByText('Memory').length).toBe(0);
  const button = screen.getByRole('button');
  await user.click(button);
  const options = screen.getAllByRole('option');
  expect(options.length).toBe(3);
  await user.click(options[1]);
  expect(handleOnSelect.mock.calls).toEqual([['memory']]);
});

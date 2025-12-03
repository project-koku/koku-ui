import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import SelectCheckboxWrapper from './selectCheckboxWrapper';

test('checkbox selector', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  const handleOnSelect = jest.fn();
  const selectOptions = [
    { toString: () => 'CPU', value: 'cpu' },
    { toString: () => 'Memory', value: 'memory' },
    { toString: () => 'Storage', value: 'storage' },
  ];
  render(
    <SelectCheckboxWrapper
      onSelect={(_evt, selection) => handleOnSelect(selection.value)}
      options={selectOptions}
      placeholder={'Resources'}
      selections={selectOptions[0]}
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
  expect(handleOnSelect.mock.calls.length).toBe(0);
  await user.click(screen.getAllByRole('checkbox')[0]);
  expect(handleOnSelect.mock.calls).toEqual([['cpu']]);
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import DropdownWrapper from './dropdownWrapper';

test('primary selector', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  const handleOnClick = jest.fn();
  const items = [
    { toString: () => 'CPU', onClick: () => handleOnClick('cpu') },
    { toString: () => 'Memory', onClick: () => handleOnClick('memory') },
    { toString: () => 'Storage', onClick: () => handleOnClick('storage') },
  ];
  render(<DropdownWrapper items={items} placeholder={'Resources'} />);
  expect(screen.queryAllByText('CPU').length).toBe(0);
  expect(screen.queryAllByText('Memory').length).toBe(0);
  const button = screen.getByRole('button');
  await user.click(button);
  const menuItems = screen.getAllByRole('menuitem');
  expect(menuItems.length).toBe(3);
  await user.click(menuItems[1]);
  expect(handleOnClick.mock.calls).toEqual([['memory']]);
});

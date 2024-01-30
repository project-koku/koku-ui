import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { PrimarySelector } from './primarySelector';

test('primary selector', async () => {
  const setPrimary = jest.fn();
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  render(
    <PrimarySelector
      primary={'metrics'}
      setPrimary={setPrimary}
      options={[
        { label: 'Metrics', value: 'metrics' },
        { label: 'Measurements', value: 'measurements' },
      ]}
    />
  );
  expect(screen.queryAllByText('Metrics').length).toBe(1);
  expect(screen.queryAllByText('Measurements').length).toBe(0);
  const button = screen.getByRole('button');
  await user.click(button);
  const options = screen.getAllByRole('option');
  expect(options.length).toBe(2);
  await user.click(options[1]);
  expect(setPrimary.mock.calls).toEqual([['measurements']]);
});

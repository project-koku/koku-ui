import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { PrimarySelector } from './primarySelector';

test('primary selector', () => {
  const setPrimary = jest.fn();
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
  userEvent.click(screen.getByRole('button'));
  expect(screen.getAllByRole('option').length).toBe(2);
  userEvent.click(screen.getAllByRole('option')[1]);
  expect(setPrimary.mock.calls).toEqual([['measurements']]);
});

import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { PrimarySelector } from './primarySelector';

test('primary selector', () => {
  const setPrimary = jest.fn();
  const { debug, queryAllByText, getByRole, getAllByRole } = render(
    <PrimarySelector
      primary={'metrics'}
      setPrimary={setPrimary}
      options={[
        { label: 'Metrics', value: 'metrics' },
        { label: 'Measurements', value: 'measurements' },
      ]}
    />
  );
  expect(queryAllByText('Metrics').length).toBe(1);
  expect(queryAllByText('Measurements').length).toBe(0);
  fireEvent.click(getByRole('button'));
  expect(getAllByRole('option').length).toBe(2);
  fireEvent.click(getAllByRole('option')[1]);
  expect(setPrimary.mock.calls).toEqual([['measurements']]);
});

import { fireEvent, queryByAltText, render } from '@testing-library/react';
import React from 'react';
import { CheckboxSelector } from './checkboxSelector';

test('checkbox selector', () => {
  const setSelections = jest.fn();
  const { queryAllByText, getByRole, getAllByRole } = render(
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
  expect(queryAllByText('Resources').length).toBe(1);
  expect(queryAllByText('CPU').length).toBe(0);
  expect(queryAllByText('Memory').length).toBe(0);
  expect(queryAllByText('Storage').length).toBe(0);
  fireEvent.click(getByRole('button'));
  expect(queryAllByText('CPU').length).toBe(1);
  expect(queryAllByText('Memory').length).toBe(1);
  expect(queryAllByText('Storage').length).toBe(1);
  expect(setSelections.mock.calls.length).toBe(0);
  fireEvent.click(getAllByRole('checkbox')[0]);
  expect(setSelections.mock.calls).toEqual([['cpu']]);
});

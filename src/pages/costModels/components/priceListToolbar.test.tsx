import { render } from '@testing-library/react';
import React from 'react';

import { PriceListToolbar } from './priceListToolbar';

test('price list toolbar', () => {
  const { queryAllByText } = render(
    <PriceListToolbar
      button={<button>Add rate</button>}
      primary={<div>Primary selector</div>}
      selected={'sec2'}
      secondaries={[
        {
          component: <div>Secondary 1</div>,
          name: 'sec1',
          onRemove: jest.fn(),
          filters: ['item1', 'item2'],
        },
        {
          component: <div>Secondary 2</div>,
          name: 'sec2',
          onRemove: jest.fn(),
          filters: ['version3'],
        },
      ]}
      onClear={jest.fn()}
      pagination={<div>Pagination</div>}
    />
  );
  expect(queryAllByText('Primary selector').length).toBe(1);
  expect(queryAllByText('Secondary 2').length).toBe(1);
  expect(queryAllByText('Secondary 1').length).toBe(0);
  expect(queryAllByText('Pagination').length).toBe(1);
  expect(queryAllByText(/sec\d/).length).toBe(2);
  expect(queryAllByText(/item\d/).length).toBe(2);
  expect(queryAllByText(/version\d/).length).toBe(1);
});

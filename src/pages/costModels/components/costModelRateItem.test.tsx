import { render } from '@testing-library/react';
import React from 'react';
import { CostModelRateItemBase } from './costModelRateItem';

test('', () => {
  const { debug, queryAllByRole } = render(
    <CostModelRateItemBase
      index={3}
      units={'gb_hours'}
      metric={'Memory'}
      measurement={'Usage'}
      rate={'10'}
      t={text => text}
      actionComponent={<button>action</button>}
    />
  );
  expect(queryAllByRole('heading').length).toBe(2);
});

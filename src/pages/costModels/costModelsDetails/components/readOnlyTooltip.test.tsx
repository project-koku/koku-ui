import { render } from '@testing-library/react';
import React from 'react';
import { ReadOnlyTooltipBase } from './readOnlyTooltip';

test('read only tooltip is disabled', () => {
  const { getByTestId } = render(
    <ReadOnlyTooltipBase isDisabled t={v => v}>
      <button>Hello world</button>
    </ReadOnlyTooltipBase>
  );
  const node = getByTestId('read-only-tooltip');
  expect(node.nodeName).toBe('DIV');
});

test('read only tooltip is enabled', () => {
  const { queryAllByTestId } = render(
    <ReadOnlyTooltipBase isDisabled={false} t={v => v}>
      <button>Hello world</button>
    </ReadOnlyTooltipBase>
  );
  const tooltips = queryAllByTestId('read-only-tooltip');
  expect(tooltips.length).toBe(0);
});

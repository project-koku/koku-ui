import { render } from '@testing-library/react';
import React from 'react';

import { ReadOnlyTooltip } from './readOnlyTooltip';

test('read only tooltip is disabled', () => {
  const { container } = render(
    <ReadOnlyTooltip isDisabled>
      <button>Hello world</button>
    </ReadOnlyTooltip>
  );
  expect(container.querySelectorAll('div')).toHaveLength(1);
});

test('read only tooltip is enabled', () => {
  const { container } = render(
    <ReadOnlyTooltip isDisabled={false}>
      <button>Hello world</button>
    </ReadOnlyTooltip>
  );
  expect(container.querySelectorAll('div')).toHaveLength(0);
});

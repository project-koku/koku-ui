import { render, screen } from '@testing-library/react';
import React from 'react';

import { ReadOnlyTooltip } from './readOnlyTooltip';

test('read only tooltip is disabled', () => {
  render(
    <ReadOnlyTooltip isDisabled>
      <button>Hello world</button>
    </ReadOnlyTooltip>
  );
  // eslint-disable-next-line testing-library/no-node-access
  expect(screen.getByRole('button').closest('div').getAttribute('aria-label')).toBe('Read only');
});

test('read only tooltip is enabled', () => {
  render(
    <ReadOnlyTooltip isDisabled={false}>
      <button>Hello world</button>
    </ReadOnlyTooltip>
  );
  // eslint-disable-next-line testing-library/prefer-presence-queries, testing-library/no-node-access
  expect(screen.getByRole('button').closest('div').getAttribute('aria-label')).toBeNull();
});

import { render } from '@testing-library/react';
import React from 'react';

import { WarningIcon } from './warningIcon';

test('warning icon', () => {
  const { container } = render(<WarningIcon text="This is the tooltip text" />);
  expect(container.querySelector('svg')).toMatchSnapshot();
});

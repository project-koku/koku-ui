import { render, screen } from '@testing-library/react';
import React from 'react';

import { WarningIcon } from './warningIcon';

test('warning icon', () => {
  render(<WarningIcon text="This is the tooltip text" />);
  expect(screen.getByRole('img', { hidden: true })).toMatchSnapshot();
});

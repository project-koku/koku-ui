import { render } from '@testing-library/react';
import React from 'react';

import EmptyValueState from './emptyValueState';

describe('EmptyValueState', () => {
  test('renders a minus icon', () => {
    const { container } = render(<EmptyValueState />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});

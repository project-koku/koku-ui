import { render } from '@testing-library/react';
import React from 'react';

import OptimizationIcon from './optimizationIcon';

const intl = {
  formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
};

describe('OptimizationIcon', () => {
  test('renders an image with the optimizations alt text', () => {
    const { container } = render(<OptimizationIcon intl={intl as any} className="custom" />);
    const image = container.querySelector('img');
    expect(image).toHaveAttribute('alt', 'Optimizations');
    expect(image).toHaveClass('optimization-icon custom');
  });
});

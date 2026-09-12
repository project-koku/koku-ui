import { render, screen } from '@testing-library/react';
import React from 'react';

import { OptimizationsWrapper } from './optimizationsWrapper';

jest.mock('@koku-ui/ui-lib/components/page/uiVersion', () => () => <div data-testid="ui-version" />);

jest.mock('store', () => ({
  rosStore: { getState: () => ({}), dispatch: jest.fn(), subscribe: jest.fn() },
}));

describe('OptimizationsWrapper', () => {
  test('renders children and the UI version', () => {
    render(
      <OptimizationsWrapper>
        <div>child</div>
      </OptimizationsWrapper>
    );

    expect(screen.getByText('child')).toBeInTheDocument();
    expect(screen.getByTestId('ui-version')).toBeInTheDocument();
  });
});

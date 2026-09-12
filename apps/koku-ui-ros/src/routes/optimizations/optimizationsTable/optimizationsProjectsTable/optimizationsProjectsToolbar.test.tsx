import { render, screen } from '@testing-library/react';
import React from 'react';

import { OptimizationsProjectsToolbar } from './optimizationsProjectsToolbar';

const intl = {
  formatMessage: ({ defaultMessage }: { defaultMessage: string }, values?: { value?: string }) =>
    values?.value || defaultMessage,
};

jest.mock('routes/components/dataToolbar', () => ({
  DataToolbar: ({ categoryOptions }: { categoryOptions?: { key: string }[] }) => (
    <div data-testid="categories">{(categoryOptions || []).map(option => option.key).join(',')}</div>
  ),
}));

describe('OptimizationsProjectsToolbar', () => {
  test('includes cluster and project categories by default', () => {
    render(
      <OptimizationsProjectsToolbar
        intl={intl as any}
        onFilterAdded={jest.fn()}
        onFilterRemoved={jest.fn()}
        query={{ filter_by: {} }}
      />
    );
    expect(screen.getByTestId('categories')).toHaveTextContent('cluster,project');
  });

  test('hides cluster and project categories', () => {
    render(
      <OptimizationsProjectsToolbar
        intl={intl as any}
        isClusterHidden
        isProjectHidden
        onFilterAdded={jest.fn()}
        onFilterRemoved={jest.fn()}
      />
    );
    expect(screen.getByTestId('categories')).toHaveTextContent('');
  });
});

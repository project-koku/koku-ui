import { render, screen } from '@testing-library/react';
import React from 'react';

import { OptimizationsToolbar } from './optimizationsToolbar';

const intl = {
  formatMessage: ({ defaultMessage }: { defaultMessage: string }, values?: { value?: string }) =>
    values?.value || defaultMessage,
};

jest.mock('routes/components/dataToolbar', () => ({
  BasicToolbar: ({ categoryOptions }: { categoryOptions?: { key: string }[] }) => (
    <div data-testid="categories">{(categoryOptions || []).map(option => option.key).join(',')}</div>
  ),
}));

describe('OptimizationsToolbar', () => {
  test('includes all filter categories by default', () => {
    render(
      <OptimizationsToolbar
        intl={intl as any}
        onFilterAdded={jest.fn()}
        onFilterRemoved={jest.fn()}
        query={{ filter_by: {} }}
      />
    );
    expect(screen.getByTestId('categories')).toHaveTextContent('container,cluster,project,workload,workload_type');
  });

  test('hides cluster and project categories', () => {
    render(
      <OptimizationsToolbar
        intl={intl as any}
        isClusterHidden
        isProjectHidden
        onFilterAdded={jest.fn()}
        onFilterRemoved={jest.fn()}
      />
    );
    expect(screen.getByTestId('categories')).toHaveTextContent('container,workload,workload_type');
    expect(screen.getByTestId('categories')).not.toHaveTextContent('cluster');
    expect(screen.getByTestId('categories')).not.toHaveTextContent('project');
  });
});

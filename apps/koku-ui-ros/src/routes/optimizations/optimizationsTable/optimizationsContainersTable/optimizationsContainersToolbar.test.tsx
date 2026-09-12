import { render, screen } from '@testing-library/react';
import React from 'react';

import { OptimizationsContainersToolbar } from './optimizationsContainersToolbar';

const intl = {
  formatMessage: ({ defaultMessage }: { defaultMessage: string }, values?: { value?: string }) =>
    values?.value || defaultMessage,
};

jest.mock('routes/components/dataToolbar', () => ({
  DataToolbar: ({ categoryOptions }: { categoryOptions?: { key: string }[] }) => (
    <div data-testid="categories">{(categoryOptions || []).map(option => option.key).join(',')}</div>
  ),
}));

describe('OptimizationsContainersToolbar', () => {
  test('includes all filter categories by default', () => {
    render(
      <OptimizationsContainersToolbar
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
      <OptimizationsContainersToolbar
        intl={intl as any}
        isClusterHidden
        isProjectHidden
        onFilterAdded={jest.fn()}
        onFilterRemoved={jest.fn()}
      />
    );
    expect(screen.getByTestId('categories')).toHaveTextContent('container,workload,workload_type');
  });
});

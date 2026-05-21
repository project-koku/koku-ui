import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { CostModelBreakdownHeader } from './costModelBreakdownHeader';

jest.mock('routes/settings/costModel/costModels/components/actions', () => ({
  CostModelActions: () => <div data-testid="cost-model-actions" />,
}));

const costModel = {
  uuid: 'cm-1',
  name: 'Test Model',
  description: 'Description',
  currency: 'USD',
  updated_timestamp: '2024-06-01T12:00:00Z',
} as any;

describe('CostModelBreakdownHeader', () => {
  test('renders title and breadcrumb', () => {
    render(
      <MemoryRouter>
        <IntlProvider locale="en">
          <CostModelBreakdownHeader canWrite costModel={costModel} onDelete={jest.fn()} onEdit={jest.fn()} />
        </IntlProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /test model/i })).toBeInTheDocument();
    expect(screen.getByText(/description/i)).toBeInTheDocument();
    expect(screen.getByTestId('cost-model-actions')).toBeInTheDocument();
  });
});

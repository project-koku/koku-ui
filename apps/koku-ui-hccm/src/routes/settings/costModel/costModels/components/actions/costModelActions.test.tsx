import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { CostModelActions } from './costModelActions';

jest.mock('../edit', () => ({
  EditCostModel: React.forwardRef(() => <div data-testid="edit-cost-model" />),
}));

jest.mock('../delete', () => ({
  DeleteCostModel: React.forwardRef(() => <div data-testid="delete-cost-model" />),
}));

jest.mock('routes/components/dropdownWrapper', () => ({
  DropdownWrapper: () => <div data-testid="dropdown-wrapper" />,
}));

const costModel = { uuid: 'cm-1', name: 'Model' } as any;

describe('CostModelActions', () => {
  test('renders edit, delete, and menu', () => {
    render(
      <IntlProvider locale="en">
        <CostModelActions canWrite costModel={costModel} onDelete={jest.fn()} onEdit={jest.fn()} />
      </IntlProvider>
    );
    expect(screen.getByTestId('edit-cost-model')).toBeInTheDocument();
    expect(screen.getByTestId('delete-cost-model')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-wrapper')).toBeInTheDocument();
  });
});

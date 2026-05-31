import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { IntegrationToolbar } from './integrationToolbar';

jest.mock('routes/components/dataToolbar', () => ({
  BasicToolbar: ({ actions }: any) => <div data-testid="basic-toolbar">{actions}</div>,
}));

jest.mock('./components/actions', () => ({
  AddIntegrationAction: () => <button type="button">assign</button>,
}));

const costModel = { uuid: 'cm-1', name: 'Model', source_type: 'OpenShift Container Platform' } as any;

describe('IntegrationToolbar', () => {
  test('renders assign action', () => {
    render(
      <IntlProvider locale="en">
        <IntegrationToolbar canWrite costModel={costModel} onAdd={jest.fn()} onFilterAdded={jest.fn()} onFilterRemoved={jest.fn()} />
      </IntlProvider>
    );
    expect(screen.getByTestId('basic-toolbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /assign/i })).toBeInTheDocument();
  });
});

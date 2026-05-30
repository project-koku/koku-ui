import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { IntegrationContentTable } from './integrationContentTable';

jest.mock('routes/components/dataTable', () => ({
  DataTable: (props: any) => <div data-testid="mock-data-table" data-rows={props.rows?.length ?? 0} />,
}));

const ocpCostModel = {
  uuid: 'cm-1',
  name: 'OCP Model',
  source_type: 'OpenShift Container Platform',
} as any;

const providers = {
  data: [
    { uuid: 'p1', name: 'Cluster 1', cost_models: [] },
    { uuid: 'p2', name: 'Cluster 2', cost_models: [{ uuid: 'other', name: 'Other Model' }] },
  ],
} as any;

describe('IntegrationContentTable', () => {
  test('renders provider rows for OCP cost model', async () => {
    render(
      <IntlProvider locale="en">
        <IntegrationContentTable
          costModel={ocpCostModel}
          onSelect={jest.fn()}
          providers={providers}
          selectedItems={[]}
        />
      </IntlProvider>
    );
    await waitFor(() => expect(screen.getByTestId('mock-data-table')).toHaveAttribute('data-rows', '2'));
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { IntegrationTable } from './integrationTable';

jest.mock('routes/components/dataTable', () => ({
  DataTable: (props: any) => <div data-testid="mock-data-table" data-rows={props.rows?.length ?? 0} />,
}));

jest.mock('./components/actions', () => ({
  DeleteIntegrationAction: () => null,
}));

const sources = [{ uuid: 's1', name: 'Source 1', source_type: 'OpenShift' }] as any;

describe('IntegrationTable', () => {
  test('renders integration rows', async () => {
    render(
      <MemoryRouter>
        <IntlProvider locale="en">
          <IntegrationTable canWrite costModel={{ uuid: 'cm-1' } as any} onSort={jest.fn()} sources={sources} />
        </IntlProvider>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId('mock-data-table')).toHaveAttribute('data-rows', '1'));
  });
});

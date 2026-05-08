import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { CostModelsTable } from './costModelsTable';

jest.mock('routes/components/dataTable', () => ({
  DataTable: (props: any) => (
    <div
      data-testid="mock-data-table"
      data-cols={props.columns?.length ?? 0}
      data-rows={props.rows?.length ?? 0}
    />
  ),
}));

describe('CostModelsTable', () => {
  const priceList = {
    assigned_cost_models: [
      { name: 'Cost model A', uuid: 'cm-a' },
      { name: 'Cost model B', uuid: 'cm-b' },
    ],
    meta: { count: 2 },
  } as any;

  test('passes one row per assigned cost model to DataTable', async () => {
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <CostModelsTable filterBy={{}} isDisabled={false} isLoading={false} priceList={priceList} />
      </IntlProvider>
    );
    await waitFor(() => {
      const table = screen.getByTestId('mock-data-table');
      expect(table).toHaveAttribute('data-rows', '2');
      expect(table).toHaveAttribute('data-cols', '1');
    });
  });
});

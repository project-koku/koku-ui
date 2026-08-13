import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import messages from '../../../../../locales/translations.json';
import { ExchangeRateTable } from './exchangeRateTable';

jest.mock('routes/components/dataTable', () => ({
  ExpandTable: (props: any) => (
    <div
      data-testid="mock-expand-table"
      data-child-rows={props.rows?.[0]?.children ? 1 : 0}
      data-rows={props.rows?.length ?? 0}
      data-cols={props.columns?.length ?? 0}
      data-loading={String(!!props.isLoading)}
    />
  ),
  DataTable: (props: any) => <div data-testid="mock-data-table" data-rows={props.rows?.length ?? 0} />,
}));

jest.mock('routes/settings/exchangeRates/exchangeRate/components/actions', () => ({
  RateActions: () => <span>actions</span>,
}));

jest.mock('./components/enable', () => ({
  EnableRate: () => <span>enable</span>,
}));

describe('ExchangeRateTable', () => {
  const noopStore = createStore(() => ({}));

  const renderTable = (ui: React.ReactElement) =>
    render(
      <Provider store={noopStore}>
        <IntlProvider locale="en" messages={messages}>
          {ui}
        </IntlProvider>
      </Provider>
    );

  const settings = {
    meta: { count: 1, limit: 10, offset: 0 },
    data: [
      {
        code: 'USD',
        description: 'US Dollar',
        enabled: true,
        has_dynamic_rate: true,
        is_disableable: true,
        static_rates: [
          {
            uuid: 'rate-1',
            base_currency: 'USD',
            target_currency: 'EUR',
            exchange_rate: 1.1,
            start_date: '2026-01-01',
            end_date: '2026-12-31',
            updated_timestamp: '2026-01-15T12:00:00Z',
          },
        ],
      },
    ],
  } as any;

  test('returns no rows when settings is missing', async () => {
    renderTable(
      <ExchangeRateTable
        canWrite
        filterBy={{}}
        isDisabled={false}
        isLoading={false}
        settings={null as any}
      />
    );
    await waitFor(() => {
      const table = screen.getByTestId('mock-expand-table');
      expect(table).toHaveAttribute('data-rows', '0');
    });
  });

  test('builds one expandable row per currency with static rates', async () => {
    renderTable(
      <ExchangeRateTable canWrite filterBy={{}} isDisabled={false} isLoading={false} settings={settings} />
    );
    await waitFor(() => {
      const table = screen.getByTestId('mock-expand-table');
      expect(table).toHaveAttribute('data-rows', '1');
      expect(table).toHaveAttribute('data-child-rows', '1');
      expect(Number(table.getAttribute('data-cols'))).toBeGreaterThan(0);
    });
  });

  test('builds parent rows without children when there are no static rates', async () => {
    const noStatic = {
      meta: { count: 1, limit: 10, offset: 0 },
      data: [
        {
          code: 'EUR',
          description: 'Euro',
          enabled: true,
          has_dynamic_rate: false,
          is_disableable: true,
          static_rates: [],
        },
      ],
    } as any;

    renderTable(
      <ExchangeRateTable canWrite filterBy={{}} isDisabled={false} isLoading={false} settings={noStatic} />
    );
    await waitFor(() => {
      const table = screen.getByTestId('mock-expand-table');
      expect(table).toHaveAttribute('data-rows', '1');
      expect(table).toHaveAttribute('data-child-rows', '0');
    });
  });

  test('passes loading state to ExpandTable', async () => {
    renderTable(<ExchangeRateTable canWrite filterBy={{}} isDisabled={false} isLoading settings={settings} />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-expand-table')).toHaveAttribute('data-loading', 'true');
    });
  });
});

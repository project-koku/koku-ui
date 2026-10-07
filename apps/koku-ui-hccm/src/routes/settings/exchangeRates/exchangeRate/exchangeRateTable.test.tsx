import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { ExchangeRateTable } from './exchangeRateTable';

const mockFormatMessage = jest.fn(
  (descriptor: { id?: string; defaultMessage?: string }, values?: Record<string, unknown>) => {
    if (descriptor.id === 'activeRate') {
      return `active-rate:${values?.value ?? ''}`;
    }
    if (descriptor.id === 'detailsResourceNames') {
      return `column:${values?.value ?? ''}`;
    }
    if (descriptor.id === 'currencyOptions') {
      return `currency:${values?.currency ?? ''}`;
    }
    if (descriptor.id === 'exchangeRateStatus') {
      return `status:${values?.value ?? ''}`;
    }
    return descriptor.id ?? descriptor.defaultMessage ?? '';
  }
);

const mockFormatDate = jest.fn(() => 'formatted-date');

jest.mock('react-intl', () => {
  // Stable reference: ExchangeRateTable's effect depends on `intl` from useIntl().
  const mockIntl = {
    formatMessage: (...args: unknown[]) => mockFormatMessage(...(args as [any, any?])),
    formatDate: (...args: unknown[]) => mockFormatDate(...(args as [])),
  };
  return {
    ...jest.requireActual('react-intl'),
    useIntl: () => mockIntl,
  };
});

jest.mock('routes/components/dataTable', () => ({
  ExpandTable: (props: any) => (
    <div
      data-testid="mock-expand-table"
      data-child-rows={props.rows?.[0]?.children ? 1 : 0}
      data-rows={props.rows?.length ?? 0}
      data-cols={props.columns?.length ?? 0}
      data-loading={String(!!props.isLoading)}
      data-order-by={props.orderBy ? JSON.stringify(props.orderBy) : ''}
      data-sort-key={props.columns?.find((col: { orderBy?: string }) => col.orderBy)?.orderBy ?? ''}
      data-sortable={String(!!props.columns?.some((col: { isSortable?: boolean }) => col.isSortable))}
    >
      <div data-testid="mock-columns">
        {props.columns?.map((col: { name?: React.ReactNode }, index: number) => (
          <span key={index} data-testid={`column-${index}`}>
            {col.name}
          </span>
        ))}
      </div>
      {props.rows?.map((row: { cells?: Array<{ value?: React.ReactNode }> }, rowIndex: number) => (
        <div key={rowIndex} data-testid={`row-${rowIndex}`}>
          {row.cells?.map((cell, cellIndex) => (
            <span key={cellIndex} data-testid={`cell-${rowIndex}-${cellIndex}`}>
              {cell.value}
            </span>
          ))}
        </div>
      ))}
      <button type="button" onClick={() => props.onSort?.(props.columns?.[1]?.orderBy, false)}>
        sort-currency
      </button>
    </div>
  ),
  DataTable: () => <div data-testid="mock-data-table" />,
}));

jest.mock('routes/settings/exchangeRates/exchangeRate/components/actions', () => ({
  RateActions: () => <span>actions</span>,
}));

jest.mock('./components/enable', () => ({
  EnableRate: () => <span>enable</span>,
}));

describe('ExchangeRateTable', () => {
  const noopStore = createStore(() => ({}));

  beforeEach(() => {
    mockFormatMessage.mockClear();
    mockFormatDate.mockClear();
  });

  const renderTable = (ui: React.ReactElement) => render(<Provider store={noopStore}>{ui}</Provider>);

  const settings = {
    meta: { count: 1, limit: 10, offset: 0 },
    data: [
      {
        code: 'USD',
        description: 'US Dollar',
        enabled: true,
        active_rate_type: 'dynamic',
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
      <ExchangeRateTable canWrite filterBy={{}} isDisabled={false} isLoading={false} settings={null as any} />
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

  test('includes an Active rate column', async () => {
    renderTable(
      <ExchangeRateTable canWrite filterBy={{}} isDisabled={false} isLoading={false} settings={settings} />
    );
    await waitFor(() => {
      expect(screen.getByTestId('column-3')).toHaveTextContent('column:active_rate');
    });
  });

  test('shows a dynamic active rate when the currency is enabled', async () => {
    renderTable(
      <ExchangeRateTable canWrite filterBy={{}} isDisabled={false} isLoading={false} settings={settings} />
    );
    await waitFor(() => {
      expect(screen.getByTestId('cell-0-3')).toHaveTextContent('active-rate:dynamic');
    });
    expect(mockFormatMessage).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'activeRate' }),
      expect.objectContaining({ value: 'dynamic' })
    );
  });

  test('shows a static active rate when the currency is enabled', async () => {
    const staticSettings = {
      ...settings,
      data: [{ ...settings.data[0], active_rate_type: 'static' }],
    };

    renderTable(
      <ExchangeRateTable canWrite filterBy={{}} isDisabled={false} isLoading={false} settings={staticSettings} />
    );
    await waitFor(() => {
      expect(screen.getByTestId('cell-0-3')).toHaveTextContent('active-rate:static');
    });
    expect(mockFormatMessage).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'activeRate' }),
      expect.objectContaining({ value: 'static' })
    );
  });

  test('shows none when the currency is disabled', async () => {
    const disabledSettings = {
      ...settings,
      data: [{ ...settings.data[0], enabled: false, active_rate_type: 'dynamic' }],
    };

    renderTable(
      <ExchangeRateTable canWrite filterBy={{}} isDisabled={false} isLoading={false} settings={disabledSettings} />
    );
    await waitFor(() => {
      expect(screen.getByTestId('cell-0-3')).toHaveTextContent('active-rate:none');
    });
    expect(mockFormatMessage).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'activeRate' }),
      expect.objectContaining({ value: 'none' })
    );
  });

  test('builds parent rows without children when there are no static rates', async () => {
    const noStatic = {
      meta: { count: 1, limit: 10, offset: 0 },
      data: [
        {
          code: 'EUR',
          description: 'Euro',
          enabled: true,
          active_rate_type: 'dynamic',
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

  test('marks the currency column as sortable and forwards the current sort', async () => {
    const onSort = jest.fn();
    renderTable(
      <ExchangeRateTable
        canWrite
        filterBy={{}}
        isDisabled={false}
        isLoading={false}
        onSort={onSort}
        orderBy={{ code: 'asc' }}
        settings={settings}
      />
    );

    await waitFor(() => {
      const table = screen.getByTestId('mock-expand-table');
      expect(table).toHaveAttribute('data-sortable', 'true');
      expect(table).toHaveAttribute('data-sort-key', 'code');
      expect(table).toHaveAttribute('data-order-by', JSON.stringify({ code: 'asc' }));
    });

    fireEvent.click(screen.getByRole('button', { name: 'sort-currency' }));
    expect(onSort).toHaveBeenCalledTimes(1);
    expect(onSort).toHaveBeenCalledWith('code', false);
  });

  test('does not mark columns sortable when there are no currencies', async () => {
    renderTable(
      <ExchangeRateTable
        canWrite
        filterBy={{}}
        isDisabled={false}
        isLoading={false}
        onSort={jest.fn()}
        orderBy={{ code: 'asc' }}
        settings={{ meta: { count: 0, limit: 10, offset: 0 }, data: [] } as any}
      />
    );

    await waitFor(() => {
      const table = screen.getByTestId('mock-expand-table');
      expect(table).toHaveAttribute('data-rows', '0');
      expect(table).toHaveAttribute('data-sortable', 'false');
      expect(table).toHaveAttribute('data-sort-key', 'code');
    });
  });
});

import 'routes/components/dataTable/dataTable.scss';

import { Label, Switch } from '@patternfly/react-core';
import type { Settings } from 'api/settings';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { DataTable, ExpandTable } from 'routes/components/dataTable';
import { formatDate } from 'utils/dates';
import { formatCurrencyRate } from 'utils/format';

import { styles } from './exchangeRateTable.styles';

interface ExchangeRateTableOwnProps {
  canWrite?: boolean;
  filterBy?: any;
  isDisabled?: boolean;
  isLoading?: boolean;
  // onClose?: () => void;
  // onDelete?: (settings: SettingsData) => void;
  // onDeprecate?: () => void;
  // onDuplicate?: () => void;
  settings: Settings;
}

type ExchangeRateTableProps = ExchangeRateTableOwnProps;

const getStaticRateStatus = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) {
    return 'unavailable';
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  if (today < start) {
    return 'pending';
  }
  if (today > end) {
    return 'expired';
  }
  return 'active';
};

const ExchangeRateTable: React.FC<ExchangeRateTableProps> = ({
  // canWrite,
  filterBy,
  // isDisabled,
  isLoading,
  // onClose,
  // onDelete,
  // onDeprecate,
  // onDuplicate,
  settings,
}) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const intl = useIntl();

  const initDatum = () => {
    if (!settings) {
      return;
    }

    const newRows = [];
    const computedItems = settings?.data ? (settings.data as any) : [];

    const newColumns = [
      {
        name: '',
        style: styles.column,
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'currency_name' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'enabled' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'active_rate' }),
      },
    ];

    const staticColumns = [
      {
        name: '', // Empty for layout
        style: styles.column,
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'base_currency' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'target_currency' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'rate' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'start' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'end' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'status' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'last_updated' }),
      },
    ];

    computedItems.map((item, index) => {
      let children;
      const isStaticRates = item?.static_rates?.length > 0;

      if (isStaticRates) {
        const staticRows = item.static_rates.map(rate => ({
          cells: [
            {}, // Empty for layout
            {
              value: rate?.base_currency ?? '',
            },
            {
              value: rate?.target_currency ?? '',
            },
            {
              value: formatCurrencyRate(Number(rate?.exchange_rate || 0), rate.base_currency || 'USD'),
            },
            {
              value: formatDate(rate?.start_date ? `${rate.start_date}T00:00:00` : ''),
            },
            {
              value: formatDate(rate?.end_date ? `${rate.end_date}T00:00:00` : ''),
            },
            {
              value: (
                <Label variant="outline">
                  {intl.formatMessage(messages.exchangeRateStatus, {
                    value: getStaticRateStatus(rate?.start_date, rate?.end_date),
                  })}
                </Label>
              ),
            },
            {
              value: rate?.updated_timestamp
                ? intl.formatDate(rate.updated_timestamp, {
                    day: 'numeric',
                    hour: 'numeric',
                    hour12: false,
                    minute: 'numeric',
                    month: 'short',
                    timeZone: 'UTC',
                    timeZoneName: 'short',
                    year: 'numeric',
                  })
                : '',
            },
          ],
        }));

        children = <DataTable columns={staticColumns} rows={staticRows} />;
      }

      newRows.push({
        cells: [
          {
            style: styles.column,
          }, // Empty cell for expand toggle
          {
            style: styles.column,
            value: item?.code || '',
          },
          {
            style: styles.column,
            value: <Switch id={`rates-toggle-${index}`} isChecked={item?.enabled} />,
          },
          {
            style: styles.column,
            value: intl.formatMessage(messages.dynamicRate, { value: item?.has_dynamic_rate }),
          },
        ],
        ...(children && { children }),
        item,
      });
    });

    setColumns(newColumns);
    setRows(newRows);
  };

  useEffect(() => {
    initDatum();
  }, [intl, settings]);

  return <ExpandTable columns={columns} filterBy={filterBy} isLoading={isLoading} rows={rows} />;
};

export { ExchangeRateTable };

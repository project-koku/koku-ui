import 'routes/components/dataTable/dataTable.scss';

import { Switch } from '@patternfly/react-core';
import type { Settings } from 'api/settings';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { DataTable } from 'routes/components/dataTable';

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
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'currency_name' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'enabled' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'active_rate' }),
      },
    ];

    computedItems.map((item, index) => {
      newRows.push({
        cells: [
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
        item,
      });
    });

    setColumns(newColumns);
    setRows(newRows);
  };

  useEffect(() => {
    initDatum();
  }, [intl, settings]);

  return <DataTable columns={columns} filterBy={filterBy} isActionsCell isLoading={isLoading} rows={rows} />;
};

export { ExchangeRateTable };

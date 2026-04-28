import 'routes/components/dataTable/dataTable.scss';
import './priceList.scss';

import { Label } from '@patternfly/react-core';
import type { PriceList } from 'api/priceList';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { DataTable } from 'routes/components/dataTable';

import { Actions } from './components/actions';
import { styles } from './priceListTable.styles';

interface PriceListTableOwnProps {
  canWrite?: boolean;
  filterBy?: any;
  isDisabled?: boolean;
  isLoading?: boolean;
  onClose?: () => void;
  onSort(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  priceList: PriceList;
}

type PriceListTableProps = PriceListTableOwnProps;

const PriceListTable: React.FC<PriceListTableProps> = ({
  canWrite,
  filterBy,
  isDisabled,
  isLoading,
  onClose,
  onSort,
  orderBy,
  priceList,
}) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const intl = useIntl();

  const initDatum = () => {
    if (!priceList) {
      return;
    }

    const newRows = [];
    const computedItems = priceList?.data ? (priceList.data as any) : [];

    const newColumns = [
      {
        orderBy: 'name',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'name' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        orderBy: 'currency',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'currency' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        orderBy: 'effective_start_date',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'start_date' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        orderBy: 'effective_end_date',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'end_date' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        orderBy: 'assigned_cost_model_count',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'cost_models' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        name: '', // Actions column
      },
    ];

    computedItems.map(item => {
      newRows.push({
        cells: [
          {
            style: styles.column,
            value: (
              <span>
                {item?.name || ''}
                {item?.enabled === false && (
                  <Label isCompact style={styles.label}>
                    {intl.formatMessage(messages.deprecated)}
                  </Label>
                )}
                <Label isCompact style={styles.label}>
                  {intl.formatMessage(messages.version, { value: item.version })}
                </Label>
              </span>
            ),
          },
          {
            style: styles.column,
            value: item?.currency || '',
          },
          {
            style: styles.column,
            value: item?.effective_start_date || '',
          },
          {
            style: styles.column,
            value: item?.effective_end_date || '',
          },
          {
            style: styles.column,
            value: item?.assigned_cost_model_count || 0,
          },
          {
            value: <Actions canWrite={canWrite} isDisabled={isDisabled} item={item} onClose={onClose} />,
          },
        ],
        item,
      });
    });

    const filteredColumns = (newColumns as any[]).filter(column => !column.hidden);
    const filteredRows = newRows.map(({ ...row }) => {
      row.cells = row.cells.filter(cell => !cell.hidden);
      return row;
    });

    setColumns(filteredColumns);
    setRows(filteredRows);
  };

  useEffect(() => {
    initDatum();
  }, [intl, priceList]);

  return (
    <DataTable
      columns={columns}
      filterBy={filterBy}
      isActionsCell
      isLoading={isLoading}
      onSort={onSort}
      orderBy={orderBy}
      rows={rows}
    />
  );
};

export { PriceListTable };

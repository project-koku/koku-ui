import 'routes/components/dataTable/dataTable.scss';
import './priceList.scss';

import { Label } from '@patternfly/react-core';
import type { PriceList, PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { DataTable } from 'routes/components/dataTable';

import { Actions } from './components/actions';
import { styles } from './priceListTable.styles';

interface PriceListTableOwnProps {
  canWrite?: boolean;
  filterBy?: any;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  onClose?: () => void;
  onSelect(items: PriceListData[], isSelected: boolean);
  onSort(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  priceList: PriceList;
  selectedItems?: PriceListData[];
}

type PriceListTableProps = PriceListTableOwnProps;

const PriceListTable: React.FC<PriceListTableProps> = ({
  canWrite,
  filterBy,
  isAllSelected,
  isDisabled,
  isLoading,
  onClose,
  onSelect,
  onSort,
  orderBy,
  priceList,
  selectedItems,
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
        name: '', // Selection column
      },
      {
        orderBy: 'name',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'name' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        orderBy: 'currency',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'currency' }),
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
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'cost_models' }),
      },
      {
        name: '', // Actions column
      },
    ];

    computedItems.map(item => {
      newRows.push({
        cells: [
          {}, // Empty cell for row selection
          {
            value: (
              <>
                {item?.name || ''}
                <Label isCompact style={styles.version}>
                  {intl.formatMessage(messages.version, { value: item.version })}
                </Label>
              </>
            ),
          },
          {
            value: item?.currency || '',
          },
          {
            value: item?.effective_start_date || '',
          },
          {
            value: item?.effective_end_date || '',
          },
          {
            value: item?.cost_models || '',
          },
          {
            value: <Actions canWrite={canWrite} isDisabled={isDisabled} item={item} onClose={onClose} />,
          },
        ],
        item,
        selected: isAllSelected || (selectedItems && selectedItems.find(val => val.uuid === item.uuid) !== undefined),
        selectionDisabled: !canWrite || item.default,
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
  }, [selectedItems, priceList]);

  return (
    <DataTable
      columns={columns}
      filterBy={filterBy}
      isLoading={isLoading}
      isSelectable
      onSelect={onSelect}
      onSort={onSort}
      orderBy={orderBy}
      rows={rows}
      selectedItems={selectedItems as any}
    />
  );
};

export { PriceListTable };

import 'routes/components/dataTable/dataTable.scss';

import { Label } from '@patternfly/react-core';
import type { PriceList, PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { DataTable } from 'routes/components/dataTable';
import { PriceListActions } from 'routes/settings/priceLists/priceList/components/actions';
import { formatDate } from 'utils/dates';
import { formatPath } from 'utils/paths';

import { styles } from './priceListContentTable.styles';

interface PriceListContentTableOwnProps {
  canWrite?: boolean;
  filterBy?: any;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  onClose?: () => void;
  onDelete?: (priceList: PriceListData) => void;
  onDeprecate?: () => void;
  onDuplicate?: () => void;
  onRemove?: (priceList: PriceListData) => void;
  onSelect?: (items: PriceListData[], isSelected: boolean) => void;
  onSort(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  priceList: PriceList;
  selectedItems: PriceListData[];
}

type PriceListContentTableProps = PriceListContentTableOwnProps;

const PriceListContentTable: React.FC<PriceListContentTableProps> = ({
  canWrite,
  filterBy,
  isAllSelected,
  isDisabled,
  isLoading,
  onClose,
  onDelete,
  onDeprecate,
  onDuplicate,
  onRemove,
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
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'rates' }),
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
            style: styles.column,
            value: (
              <span>
                {item?.name && (
                  <Link to={`${formatPath(routes.priceListBreakdown.basePath)}/${item?.uuid}`}>{item.name}</Link>
                )}
                {item?.enabled === false && (
                  <Label isCompact style={styles.label}>
                    {intl.formatMessage(messages.deprecated)}
                  </Label>
                )}
                <Label isCompact style={styles.label}>
                  {intl.formatMessage(messages.version, { value: item?.version })}
                </Label>
              </span>
            ),
          },
          {
            style: styles.column,
            value: formatDate(item?.effective_start_date ? `${item.effective_start_date}T00:00:00` : ''),
          },
          {
            style: styles.column,
            value: formatDate(item?.effective_end_date ? `${item.effective_end_date}T00:00:00` : ''),
          },
          {
            style: styles.column,
            value: item?.rates?.length || 0,
          },
          {
            value: (
              <PriceListActions
                canWrite={canWrite}
                isDuplicateAction
                isRemovePriceListAction
                isViewPriceListAction
                isDisabled={isDisabled}
                onClose={onClose}
                onDelete={onDelete}
                onDeprecate={onDeprecate}
                onDuplicate={onDuplicate}
                onRemove={onRemove}
                priceList={item}
              />
            ),
          },
        ],
        item,
        selected: isAllSelected || selectedItems?.some(val => val.uuid === item.uuid),
      });
    });

    setColumns(newColumns);
    setRows(newRows);
  };

  useEffect(() => {
    initDatum();
  }, [intl, priceList, selectedItems]);

  return (
    <DataTable
      columns={columns}
      filterBy={filterBy}
      isActionsCell
      isLoading={isLoading}
      isSelectable
      onSelect={onSelect}
      onSort={onSort}
      orderBy={orderBy}
      rows={rows}
    />
  );
};

export { PriceListContentTable };

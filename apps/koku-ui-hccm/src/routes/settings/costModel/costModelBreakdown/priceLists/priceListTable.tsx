import 'routes/components/dataTable/dataTable.scss';

import { Label } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { DraggableTable } from 'routes/components/dataTable';
import { RemovePriceListAction } from 'routes/settings/costModel/costModelBreakdown/priceLists/components/actions';
import { formatDate } from 'utils/dates';
import { formatPath } from 'utils/paths';

import { styles } from './priceListTable.styles';

interface PriceListTableOwnProps {
  canWrite?: boolean;
  costModel: CostModel;
  filterBy?: any;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  isDraggable?: boolean;
  isLoading?: boolean;
  onClose?: () => void;
  onDrop?: (rowIDs: string[]) => void;
  onRemove?: (priceList: PriceListData[]) => void;
  onSelect?: (items: PriceListData[], isSelected: boolean) => void;
  orderBy?: any;
  priceLists?: PriceListData[]; // Filtered and paginated price lists
  selectedItems?: PriceListData[];
}

type PriceListTableProps = PriceListTableOwnProps;

const PriceListTable: React.FC<PriceListTableProps> = ({
  canWrite,
  costModel,
  filterBy,
  isAllSelected,
  isDisabled,
  isDraggable,
  isLoading,
  onClose,
  onDrop,
  onRemove,
  onSelect,
  orderBy,
  priceLists,
  selectedItems,
}) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const intl = useIntl();

  const initDatum = () => {
    if (!priceLists) {
      return;
    }

    const newRows = [];
    const computedItems = priceLists ?? [];

    const newColumns = [
      {
        name: '', // Drag column
      },
      {
        name: '', // Selection column
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'name' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'start_date' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'end_date' }),
      },
      {
        isActionsCell: true,
        name: '', // Actions column
      },
    ];

    computedItems.forEach(item => {
      newRows.push({
        cells: [
          {}, // Empty cell for row drag
          {}, // Empty cell for row selection
          {
            style: styles.column,
            value: (
              <span>
                <Link to={`${formatPath(routes.priceListBreakdown.basePath)}/${item.uuid}`}>{item.name}</Link>
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
            value: (
              <RemovePriceListAction
                costModel={costModel}
                canWrite={canWrite}
                isDisabled={isDisabled}
                onClose={onClose}
                onRemove={onRemove}
                priceList={item}
              />
            ),
          },
        ],
        id: item?.uuid,
        item,
        selected: isAllSelected || selectedItems?.some(val => val.uuid === item.uuid),
      });
    });

    setColumns(newColumns);
    setRows(newRows);
  };

  useEffect(() => {
    initDatum();
  }, [costModel, priceLists, selectedItems]);

  return (
    <DraggableTable
      isDraggable={isDraggable}
      isSelectable
      columns={columns}
      filterBy={filterBy}
      isActionsCell
      isLoading={isLoading}
      onDrop={onDrop}
      orderBy={orderBy}
      onSelect={onSelect}
      rows={rows}
    />
  );
};

export { PriceListTable };

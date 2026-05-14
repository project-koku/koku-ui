import 'routes/components/dataTable/dataTable.scss';

import type { CostModels } from 'api/costModels';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { DataTable } from 'routes/components/dataTable';
import { DeleteCostModelAction } from 'routes/settings/costModel/costModels/components/actions';
import { NoCostModelsState } from 'routes/settings/costModel/costModels/components/state';
import { formatPath } from 'utils/paths';

import { styles } from './costModelsTable.styles';

interface CostModelsTableOwnProps {
  canWrite?: boolean;
  costModels: CostModels;
  filterBy?: any;
  isDisabled?: boolean;
  isLoading?: boolean;
  onClose?: () => void;
  onDelete?: () => void;
  onSort(sortType: string, isSortAscending: boolean);
  orderBy?: any;
}

type CostModelsTableProps = CostModelsTableOwnProps;

const CostModelsTable: React.FC<CostModelsTableProps> = ({
  canWrite,
  costModels,
  filterBy,
  isDisabled,
  isLoading,
  onClose,
  onDelete,
  onSort,
  orderBy,
}) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const intl = useIntl();

  const initDatum = () => {
    if (!costModels) {
      return;
    }

    const newRows = [];
    const computedItems = costModels?.data ? costModels.data : [];

    const newColumns = [
      {
        orderBy: 'name',
        name: intl.formatMessage(messages.names, { count: 1 }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        name: intl.formatMessage(messages.description),
      },
      {
        orderBy: 'source_type',
        name: intl.formatMessage(messages.sourceType),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        name: intl.formatMessage(messages.costModelsAssignedSources),
      },
      {
        orderBy: 'updated_timestamp',
        name: intl.formatMessage(messages.costModelsLastUpdated),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        name: '', // Actions column
      },
    ];

    computedItems.forEach(item => {
      newRows.push({
        cells: [
          {
            style: styles.column,
            value: <Link to={`${formatPath(routes.costModelBreakdown.basePath)}/${item.uuid}`}>{item.name}</Link>,
          },
          {
            style: styles.column,
            value: item?.description || '',
          },
          {
            style: styles.column,
            value: item?.source_type || '',
          },
          {
            style: styles.column,
            value: item?.sources?.length || 0,
          },
          {
            style: styles.column,
            value: intl.formatDate(item.updated_timestamp, {
              day: 'numeric',
              hour: 'numeric',
              hour12: false,
              minute: 'numeric',
              month: 'short',
              timeZone: 'UTC',
              timeZoneName: 'short',
              year: 'numeric',
            }),
          },
          {
            value: (
              <DeleteCostModelAction
                costModel={item}
                canWrite={canWrite}
                isDisabled={isDisabled}
                onClose={onClose}
                onDelete={onDelete}
              />
            ),
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
  }, [intl, costModels]);

  return (
    <DataTable
      columns={columns}
      emptyState={<NoCostModelsState canWrite={canWrite} />}
      filterBy={filterBy}
      isActionsCell
      isLoading={isLoading}
      onSort={onSort}
      orderBy={orderBy}
      rows={rows}
    />
  );
};

export { CostModelsTable };

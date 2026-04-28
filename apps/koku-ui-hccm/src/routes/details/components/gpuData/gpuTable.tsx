import { Truncate } from '@patternfly/react-core';
import type { OcpReport } from 'api/reports/ocpReports';
import type { OcpReportItem } from 'api/reports/ocpReports';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { DataTable, ExpandableTable } from 'routes/components/dataTable';
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import { formatUnits, unitsLookupKey } from 'utils/format';

import { styles } from './gpuTable.styles';
import { MigData } from './migData';

interface GpuTableOwnProps {
  filterBy?: any;
  gridBreakPoint?: '' | 'grid' | 'grid-md' | 'grid-lg' | 'grid-xl' | 'grid-2xl';
  isLoading?: boolean;
  isMigToggleEnabled?: boolean;
  onSort(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  queryStateName: string;
  report: OcpReport;
}

type GpuTableProps = GpuTableOwnProps;
const GpuTable: React.FC<GpuTableProps> = ({
  filterBy,
  gridBreakPoint,
  isLoading,
  isMigToggleEnabled,
  onSort,
  orderBy,
  queryStateName,
  report,
}) => {
  const intl = useIntl();

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const initDatum = () => {
    if (!report) {
      return;
    }

    const computedItems = getUnsortedComputedReportItems<OcpReport, OcpReportItem>({
      report,
      idKey: 'gpu_name',
    });

    const newRows = [];
    const newColumns = [
      {
        name: '',
        style: styles.column,
      },
      {
        name: intl.formatMessage(messages.gpuColumns, { value: 'gpu_vendor' }),
        orderBy: 'gpu_vendor',
        isSortable: true,
        style: styles.column,
      },
      {
        name: intl.formatMessage(messages.gpuColumns, { value: 'gpu_model' }),
        orderBy: 'gpu_model',
        isSortable: true,
        style: styles.columnModel,
      },
      {
        name: intl.formatMessage(messages.gpuColumns, { value: 'node' }),
        orderBy: 'node',
        isSortable: true,
        style: styles.columnNode,
      },
      {
        name: intl.formatMessage(messages.gpuColumns, { value: 'count' }),
        orderBy: 'gpu_count',
        isSortable: true,
        style: styles.column,
      },
      {
        name: intl.formatMessage(messages.gpuColumns, { value: 'memory' }),
        orderBy: 'gpu_memory',
        isSortable: true,
        style: styles.column,
      },
      {
        hidden: !isMigToggleEnabled,
        name: intl.formatMessage(messages.gpuColumns, { value: 'mode' }),
        orderBy: 'gpu_mode',
        isSortable: true,
        style: styles.column,
      },
    ];

    computedItems.map(item => {
      newRows.push({
        cells: [
          {
            style: styles.column,
          }, // Empty cell for expand toggle
          {
            style: styles.column,
            value: item?.gpu_vendor ?? '',
          },
          {
            style: styles.columnModel,
            value: <Truncate content={item?.gpu_model ?? ''} />,
          },
          {
            style: styles.columnNode,
            value: <Truncate content={item?.node ?? ''} />,
          },
          {
            style: styles.column,
            value: item?.gpu_count?.value ?? '',
          },
          {
            style: styles.column,
            value: intl.formatMessage(messages.valueUnits, {
              value:
                item?.gpu_memory?.value !== undefined ? formatUnits(item.gpu_memory.value, item.gpu_memory.units) : '',
              units: item?.gpu_memory?.units
                ? intl.formatMessage(messages.units, { units: unitsLookupKey(item.gpu_memory.units) })
                : null,
            }),
          },
          {
            hidden: !isMigToggleEnabled,
            style: styles.column,
            value: item?.gpu_mode ?? '',
          },
        ],
        // Workaround for old versions of the operator not having mig profile fields yet, so the API may return zero here
        children: typeof item?.gpu_mode === 'string' &&
          item?.gpu_mode?.toLowerCase() === 'mig' &&
          isMigToggleEnabled && (
            <MigData
              gpu_model={item?.gpu_model}
              gpu_vendor={item?.gpu_vendor}
              node={item?.node}
              queryStateName={queryStateName}
            />
          ),
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

  const handleOnSort = (sortType: string, isSortAscending: boolean) => {
    if (onSort) {
      onSort(sortType, isSortAscending);
    }
  };

  useEffect(() => {
    initDatum();
  }, [report]);

  return isMigToggleEnabled ? (
    <ExpandableTable
      columns={columns}
      filterBy={filterBy}
      gridBreakPoint={gridBreakPoint}
      isLoading={isLoading}
      onSort={handleOnSort}
      orderBy={orderBy}
      rows={rows}
    />
  ) : (
    <DataTable
      columns={columns}
      filterBy={filterBy}
      isLoading={isLoading}
      onSort={handleOnSort}
      orderBy={orderBy}
      rows={rows}
    />
  );
};

export { GpuTable };

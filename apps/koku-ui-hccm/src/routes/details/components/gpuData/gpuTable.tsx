import type { OcpReport } from 'api/reports/ocpReports';
import type { OcpReportItem } from 'api/reports/ocpReports';
import type { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { DataTable, ExpandableTable } from 'routes/components/dataTable';
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import { formatUnits, unitsLookupKey } from 'utils/format';

import { MigData } from './migData';

interface GpuTableOwnProps {
  filterBy?: any;
  gridBreakPoint?: '' | 'grid' | 'grid-md' | 'grid-lg' | 'grid-xl' | 'grid-2xl';
  isLoading?: boolean;
  isMigToggleEnabled?: boolean;
  onSort(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  report: OcpReport;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

type GpuTableProps = GpuTableOwnProps;
const GpuTable: React.FC<GpuTableProps> = ({
  filterBy,
  gridBreakPoint,
  isLoading,
  isMigToggleEnabled,
  onSort,
  orderBy,
  report,
  reportPathsType,
  reportType,
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
      },
      {
        name: intl.formatMessage(messages.gpuColumns, { value: 'gpu_vendor' }),
        orderBy: 'gpu_vendor',
        isSortable: true,
      },
      {
        name: intl.formatMessage(messages.gpuColumns, { value: 'gpu_model' }),
        orderBy: 'gpu_model',
        isSortable: true,
      },
      {
        name: intl.formatMessage(messages.gpuColumns, { value: 'node' }),
        orderBy: 'node',
        isSortable: true,
      },
      {
        name: intl.formatMessage(messages.gpuColumns, { value: 'count' }),
        orderBy: 'gpu_count',
        isSortable: true,
      },
      {
        name: intl.formatMessage(messages.gpuColumns, { value: 'memory' }),
        orderBy: 'gpu_memory',
        isSortable: true,
      },
      {
        hidden: !isMigToggleEnabled,
        name: intl.formatMessage(messages.gpuColumns, { value: 'mode' }),
        orderBy: 'gpu_mode',
        isSortable: true,
      },
    ];

    computedItems.map(item => {
      newRows.push({
        cells: [
          {}, // Empty cell for expand toggle
          {
            value: item?.gpu_vendor ?? '',
          },
          {
            value: item?.gpu_model ?? '',
          },
          {
            value: item?.node ?? '',
          },
          {
            value: item?.gpu_count?.value ?? '',
          },
          {
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
            value: item?.gpu_mode ?? '',
          },
        ],
        children: item?.gpu_mode?.toLowerCase() === 'mig' && isMigToggleEnabled && (
          <MigData reportPathsType={reportPathsType} reportType={reportType} />
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

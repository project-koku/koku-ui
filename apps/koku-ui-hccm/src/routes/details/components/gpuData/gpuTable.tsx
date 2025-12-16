import 'routes/components/dataTable/dataTable.scss';

import type { OcpReport } from 'api/reports/ocpReports';
import type { OcpReportItem } from 'api/reports/ocpReports';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { DataTable } from 'routes/components/dataTable';
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import { formatUnits, unitsLookupKey } from 'utils/format';

interface GpuTableOwnProps {
  isLoading?: boolean;
  onSort(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  report: OcpReport;
  reportQueryString: string;
}

type GpuTableProps = GpuTableOwnProps;
const GpuTable: React.FC<GpuTableProps> = ({ isLoading, onSort, orderBy, report }) => {
  const intl = useIntl();

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const initDatum = () => {
    if (!report) {
      return;
    }

    const computedItems = getUnsortedComputedReportItems<OcpReport, OcpReportItem>({
      report,
      idKey: 'date',
    });

    const newRows = [];
    const newColumns = [
      {
        name: intl.formatMessage(messages.gpuColumns, { value: 'vendor' }),
        orderBy: 'vendor_name',
        isSortable: true, // Disabled due to "order_by requires matching group_by" bug
      },
      {
        name: intl.formatMessage(messages.gpuColumns, { value: 'model' }),
        orderBy: 'model_name',
        isSortable: true, // Disabled due to "order_by requires matching group_by" bug
      },
      {
        name: intl.formatMessage(messages.gpuColumns, { value: 'node' }),
        orderBy: 'node',
        isSortable: true, // Disabled due to "order_by requires matching group_by" bug
      },
      {
        name: intl.formatMessage(messages.gpuColumns, { value: 'count' }),
        orderBy: 'gpu_count',
        isSortable: true,
      },
      {
        name: intl.formatMessage(messages.gpuColumns, { value: 'memory' }),
        orderBy: 'memory',
        isSortable: true,
      },
    ];

    computedItems.map(item => {
      newRows.push({
        cells: [
          {
            value: item?.vendor ?? '',
          },
          {
            value: item?.model ?? '',
          },
          {
            value: item?.node ?? '',
          },
          {
            value: item.gpu_count?.value ?? '',
          },
          {
            value: intl.formatMessage(messages.valueUnits, {
              value: item?.memory?.value !== undefined ? formatUnits(item.memory.value, item.memory.units) : '',
              units: item?.memory?.units
                ? intl.formatMessage(messages.units, { units: unitsLookupKey(item.memory.units) })
                : null,
            }),
          },
        ],
      });
    });
    setColumns(newColumns);
    setRows(newRows);
  };

  const handleOnSort = (sortType: string, isSortAscending: boolean) => {
    if (onSort) {
      onSort(sortType, isSortAscending);
    }
  };

  useEffect(() => {
    initDatum();
  }, [report]);

  return <DataTable columns={columns} isLoading={isLoading} onSort={handleOnSort} orderBy={orderBy} rows={rows} />;
};

export { GpuTable };

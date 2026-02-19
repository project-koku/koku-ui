import type { OcpReport } from 'api/reports/ocpReports';
import type { OcpReportItem } from 'api/reports/ocpReports';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { DataTable } from 'routes/components/dataTable';
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import { formatUnits, unitsLookupKey } from 'utils/format';

import { styles } from './migTable.styles';

interface MigTableOwnProps {
  filterBy?: any;
  isLoading?: boolean;
  onSort(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  report: OcpReport;
}

type MigTableProps = MigTableOwnProps;
const MigTable: React.FC<MigTableProps> = ({ filterBy, isLoading, onSort, orderBy, report }) => {
  const intl = useIntl();

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const initDatum = () => {
    if (!report) {
      return;
    }

    const computedItems = getUnsortedComputedReportItems<OcpReport, OcpReportItem>({
      report,
      idKey: 'mig_name',
    });

    const newRows = [];
    const newColumns = [
      {
        name: '',
        style: styles.header,
      },
      {
        name: intl.formatMessage(messages.migColumns, { value: 'uuid' }),
        orderBy: 'uuid',
        isSortable: true,
      },
      {
        name: intl.formatMessage(messages.migColumns, { value: 'compute' }),
        orderBy: 'compute',
        isSortable: true,
      },
      {
        name: intl.formatMessage(messages.migColumns, { value: 'memory' }),
        orderBy: 'memory',
        isSortable: true,
      },
    ];

    computedItems.map(item => {
      newRows.push({
        cells: [
          {}, // Empty cell for expand toggle
          {
            value: item?.mig_uuid ?? '',
          },
          {
            value: item?.mig_compute ?? '',
          },
          {
            value: intl.formatMessage(messages.valueUnits, {
              value:
                item?.mig_memory?.value !== undefined ? formatUnits(item.mig_memory.value, item.mig_memory.units) : '',
              units: item?.mig_memory?.units
                ? intl.formatMessage(messages.units, { units: unitsLookupKey(item.mig_memory.units) })
                : null,
            }),
          },
        ],
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

  return (
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

export { MigTable };

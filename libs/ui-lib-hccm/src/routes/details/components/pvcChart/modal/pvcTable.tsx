import '../../../../components/dataTable/dataTable.scss';

import type { OcpReport } from '@koku-ui/api/reports/ocpReports';
import type { OcpReportItem } from '@koku-ui/api/reports/ocpReports';
import messages from '@koku-ui/i18n/locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { formatUsage, unitsLookupKey } from '../../../../../utils/format';
import { DataTable } from '../../../../components/dataTable';
import { styles } from '../../../../components/dataTable/dataTable.styles';
import { getUnsortedComputedReportItems } from '../../../../utils/computedReport/getComputedReportItems';

interface PvcTableOwnProps {
  filterBy?: any;
  isLoading?: boolean;
  onSort(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  report: OcpReport;
  reportQueryString: string;
}

type PvcTableProps = PvcTableOwnProps;
const PvcTable: React.FC<PvcTableProps> = ({ filterBy, isLoading, onSort, orderBy, report }) => {
  const intl = useIntl();

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const initDatum = () => {
    if (!report) {
      return;
    }

    const computedItems = getUnsortedComputedReportItems<OcpReport, OcpReportItem>({
      report,
      idKey: 'persistentvolumeclaim' as any,
    });

    const newRows = [];
    const newColumns = [
      {
        name: intl.formatMessage(messages.names, { count: 1 }),
        orderBy: 'persistentvolumeclaim',
        ...(computedItems.length && { isSortable: true }),
      },
      {
        name: intl.formatMessage(messages.cluster),
        orderBy: 'cluster',
        ...(computedItems.length && { isSortable: true }),
      },
      {
        name: intl.formatMessage(messages.storageClass),
        orderBy: 'storage_class',
        ...(computedItems.length && { isSortable: true }),
      },
      {
        name: intl.formatMessage(messages.usage),
        orderBy: 'usage',
        ...(computedItems.length && { isSortable: true }),
      },
      {
        name: intl.formatMessage(messages.requestedCapacity),
        orderBy: 'request',
        style: styles.lastItemColumn,
        ...(computedItems.length && { isSortable: true }),
      },
    ];

    computedItems.map(item => {
      const cluster = item.cluster ? item.cluster : '';
      const pvc = item.persistent_volume_claim ? item.persistent_volume_claim[0] : '';
      const storageClass = item.storage_class ? item.storage_class[0] : '';

      const request = item.request ? item.request.value : 0;
      const requestValue = formatUsage(request);
      const requestUnits = intl.formatMessage(messages.units, {
        units: unitsLookupKey(item.request ? item.request.units : undefined),
      });

      const usage = item.usage ? item.usage.value : 0;
      const usageValue = formatUsage(usage);
      const usageUnits = intl.formatMessage(messages.units, {
        units: unitsLookupKey(item.usage ? item.usage.units : undefined),
      });

      newRows.push({
        cells: [
          { value: pvc },
          { value: cluster },
          { value: storageClass },
          {
            value: intl.formatMessage(messages.valueUnits, {
              value: usageValue,
              units: usageUnits,
            }),
          },
          {
            value: intl.formatMessage(messages.valueUnits, {
              value: requestValue,
              units: requestUnits,
            }),
            style: styles.lastItem,
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

export { PvcTable };

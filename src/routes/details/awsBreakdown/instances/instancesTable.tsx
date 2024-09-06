import 'routes/components/dataTable/dataTable.scss';

import type { Query } from 'api/queries/query';
import type { AwsReport, AwsReportItem } from 'api/reports/awsReports';
import type { Report } from 'api/reports/report';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { DataTable } from 'routes/components/dataTable';
import { styles } from 'routes/components/dataTable/dataTable.styles';
import { NoInstancesState } from 'routes/components/page/noInstances/noInstancesState';
import { Actions } from 'routes/details/components/actions';
import { TagLink } from 'routes/details/components/tag';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import { formatCurrency, formatUnits, unitsLookupKey } from 'utils/format';

interface InstancesTableOwnProps {
  filterBy?: any;
  hiddenColumns?: Set<string>;
  isAllSelected?: boolean;
  isLoading?: boolean;
  onSelect(items: ComputedReportItem[], isSelected: boolean);
  onSort(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  query?: Query;
  report?: Report;
  reportPathsType: string;
  reportQueryString: string;
  reportType: string;
  selectedItems?: ComputedReportItem[];
}

type InstancesTableProps = InstancesTableOwnProps;

export const InstanceTableColumnIds = {
  memory: 'memory',
  usage: 'usage',
  vcpu: 'vcpu',
};

const InstancesTable: React.FC<InstancesTableProps> = ({
  filterBy,
  hiddenColumns,
  isAllSelected,
  isLoading,
  onSelect,
  onSort,
  orderBy,
  report,
  reportPathsType,
  reportQueryString,
  reportType,
  selectedItems,
}) => {
  const intl = useIntl();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const initDatum = () => {
    if (!report) {
      return;
    }

    const newRows = [];
    const computedItems = getUnsortedComputedReportItems<AwsReport, AwsReportItem>({
      idKey: 'resource_id',
      report,
    });

    // Sorting with tag keys is not supported
    const newColumns = [
      {
        name: '',
      },
      {
        orderBy: 'instance_name',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'instance' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        orderBy: 'account_alias',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'account' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        orderBy: 'operating_system',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'os' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'tags' }),
      },
      {
        orderBy: 'instance_type',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'instance_type' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        orderBy: 'region',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'region' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        id: InstanceTableColumnIds.vcpu,
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'vcpu' }),
        style: styles.managedColumn,
      },
      {
        id: InstanceTableColumnIds.memory,
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'memory' }),
        style: styles.managedColumn,
      },
      {
        id: InstanceTableColumnIds.usage,
        orderBy: 'usage',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'usage' }),
        style: styles.managedColumn,
        ...(computedItems.length && { isSortable: true }),
      },
      {
        orderBy: 'cost',
        name: intl.formatMessage(messages.cost),
        style: styles.costColumn,
        ...(computedItems.length && { isSortable: true }),
      },
      {
        name: '',
      },
    ];

    computedItems.map(item => {
      const cost = getTotalCost(item);
      const actions = getActions(item);

      newRows.push({
        cells: [
          {}, // Empty cell for row selection
          {
            value: (
              <>
                <div>{item.instance_name ? item.instance_name : null}</div>
                <div style={styles.infoDescription}>{item.resource_id ? item.resource_id : null}</div>
              </>
            ),
          },
          {
            value: (
              <>
                <div>{item.account_alias ? item.account_alias : null}</div>
                <div style={styles.infoDescription}>{item.account ? item.account : null}</div>
              </>
            ),
          },
          { value: item.operating_system ? item.operating_system : null },
          { value: <TagLink tagData={item.tags} /> },
          { value: item.instance_type ? item.instance_type : null },
          { value: item.region ? item.region : null },
          {
            value: item.vcpu ? item.vcpu : '',
            id: InstanceTableColumnIds.vcpu,
            style: styles.managedColumn,
          },
          {
            value: item.memory ? item.memory : '', // Not translatable
            id: InstanceTableColumnIds.memory,
            style: styles.managedColumn,
          },
          {
            value: intl.formatMessage(messages.valueUnits, {
              value: item.usage ? formatUnits(item.usage.value, item.usage.units) : '',
              units: item.usage
                ? intl.formatMessage(messages.units, { units: unitsLookupKey(item.usage.units) })
                : null,
            }),
            id: InstanceTableColumnIds.usage,
            style: styles.managedColumn,
          },
          { value: cost, style: styles.managedColumn },
          { value: actions },
        ],
        item,
        selected: isAllSelected || (selectedItems && selectedItems.find(val => val.id === item.id) !== undefined),
      });
    });

    const filteredColumns = (newColumns as any[]).filter(column => !hiddenColumns.has(column.id) && !column.hidden);
    const filteredRows = newRows.map(({ ...row }) => {
      row.cells = row.cells.filter(cell => !hiddenColumns.has(cell.id) && !cell.hidden);
      return row;
    });
    setColumns(filteredColumns);
    setRows(filteredRows);
  };

  const getActions = (item: ComputedReportItem, isDisabled = false) => {
    // There is no group by for instances, but we use it to format messages
    return (
      <Actions
        groupBy={'instance'}
        isDisabled={isDisabled}
        item={item}
        reportPathsType={reportPathsType}
        reportQueryString={reportQueryString}
        reportType={reportType}
        showAggregateType={false}
      />
    );
  };

  const getTotalCost = (item: ComputedReportItem) => {
    const value = item.cost?.total?.value || 0;
    const units = item.cost?.total?.units || 'USD';
    return formatCurrency(value, units);
  };

  const handleOnSort = (sortType: string, isSortAscending: boolean) => {
    if (onSort) {
      onSort(sortType, isSortAscending);
    }
  };

  useEffect(() => {
    initDatum();
  }, [hiddenColumns, report, selectedItems]);

  return (
    <DataTable
      columns={columns}
      emptyState={<NoInstancesState />}
      filterBy={filterBy}
      isActionsCell
      isLoading={isLoading}
      isSelectable
      onSelect={onSelect}
      onSort={handleOnSort}
      orderBy={orderBy}
      rows={rows}
      selectedItems={selectedItems}
    />
  );
};

export { InstancesTable };

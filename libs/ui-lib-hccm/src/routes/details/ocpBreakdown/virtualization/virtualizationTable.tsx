import '../../../components/dataTable/dataTable.scss';

import type { Query } from '@koku-ui/api/queries/query';
import type { OcpReport, OcpReportItem } from '@koku-ui/api/reports/ocpReports';
import type { Report } from '@koku-ui/api/reports/report';
import type { TagPathsType } from '@koku-ui/api/tags/tag';
import messages from '@koku-ui/i18n/locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { formatCurrency, formatUnits, unitsLookupKey } from '../../../../utils/format';
import { ComputedReportItemValueType } from '../../../components/charts/common';
import { DataTable } from '../../../components/dataTable';
import { styles } from '../../../components/dataTable/dataTable.styles';
import { NoVirtualizationState } from '../../../components/page/noVirtualization/noVirtualizationState';
import type { ComputedReportItem } from '../../../utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from '../../../utils/computedReport/getComputedReportItems';
import { Actions } from '../../components/actions';
import { TagLink } from '../../components/tag';
import { StorageLink } from './storage';

interface VirtualizationTableOwnProps {
  costDistribution?: string;
  exclude?: any;
  filterBy?: any;
  hideCluster?: boolean;
  hideNode?: boolean;
  hideProject?: boolean;
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
  tagPathsType: TagPathsType;
}

type VirtualizationTableProps = VirtualizationTableOwnProps;

export const VirtualizationTableColumnIds = {
  cpu: 'cpu',
  memory: 'memory',
};

const VirtualizationTable: React.FC<VirtualizationTableProps> = ({
  costDistribution,
  exclude,
  filterBy,
  hideCluster,
  hideNode,
  hideProject,
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
  tagPathsType,
}) => {
  const intl = useIntl();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const initDatum = () => {
    if (!report) {
      return;
    }

    const newRows = [];
    const computedItems = getUnsortedComputedReportItems<OcpReport, OcpReportItem>({
      idKey: 'vm_name',
      report,
    });

    // Sorting with tag keys is not supported
    const newColumns = [
      {
        name: '',
      },
      {
        orderBy: 'vm_name',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'vm_name' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        hidden: hideProject,
        orderBy: 'project',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'project' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        hidden: hideCluster,
        orderBy: 'cluster',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'cluster' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        hidden: hideNode,
        orderBy: 'node',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'node' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'storage' }),
      },
      {
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'tags' }),
      },
      {
        id: VirtualizationTableColumnIds.cpu,
        orderBy: 'request_cpu',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'cpu' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        id: VirtualizationTableColumnIds.memory,
        orderBy: 'request_memory',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'memory' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        orderBy: costDistribution === ComputedReportItemValueType.distributed ? 'distributed_cost' : 'cost',
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
            value: item.vm_name ? item.vm_name : null,
          },
          {
            hidden: hideProject,
            value: item.project ? item.project : null,
          },
          {
            hidden: hideCluster,
            value: item.cluster ? item.cluster : null,
          },
          {
            hidden: hideNode,
            value: item.node ? item.node : null,
          },
          {
            value: <StorageLink storageData={item.storage} virtualMachine={item.vm_name} />,
          },
          {
            value: <TagLink tagData={item.tags} tagPathsType={tagPathsType} virtualMachine={item.vm_name} />,
          },
          {
            id: VirtualizationTableColumnIds.cpu,
            value: intl.formatMessage(messages.valueUnits, {
              value:
                item.request?.cpu?.value !== undefined
                  ? formatUnits(item.request.cpu.value, item.request.cpu.units)
                  : '',
              units: item.request?.cpu?.units
                ? intl.formatMessage(messages.units, { units: unitsLookupKey(item.request.cpu.units) })
                : null,
            }),
          },
          {
            id: VirtualizationTableColumnIds.memory,
            value: intl.formatMessage(messages.valueUnits, {
              value:
                item.request?.memory?.value !== undefined
                  ? formatUnits(item.request.memory.value, item.request.memory.units)
                  : '',
              units: item.request?.memory?.units
                ? intl.formatMessage(messages.units, { units: unitsLookupKey(item.request.memory.units) })
                : null,
            }),
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
    // There is no group by for virtualization, but we use it to format messages
    return (
      <Actions
        groupBy="vm_name"
        isDisabled={isDisabled}
        item={item}
        isTimeScoped
        reportPathsType={reportPathsType}
        reportQueryString={reportQueryString}
        reportType={reportType}
        showAggregateType={false}
      />
    );
  };

  const getTotalCost = (item: ComputedReportItem) => {
    const reportItemValue = costDistribution ? costDistribution : ComputedReportItemValueType.total;
    const hasTotal = item?.cost?.[reportItemValue];
    const value = hasTotal ? item?.cost?.[reportItemValue]?.value : 0;
    const units = hasTotal ? item?.cost?.[reportItemValue]?.units : 'USD';
    return formatCurrency(value, units);
  };

  const handleOnSort = (sortType: string, isSortAscending: boolean) => {
    if (onSort) {
      onSort(sortType, isSortAscending);
    }
  };

  useEffect(() => {
    initDatum();
  }, [costDistribution, hiddenColumns, report, selectedItems]);

  return (
    <DataTable
      columns={columns}
      emptyState={<NoVirtualizationState />}
      exclude={exclude}
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

export { VirtualizationTable };

import type { OcpReport, OcpReportItem } from 'api/reports/ocpReports';
import messages from 'locales/messages';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { DataTable } from 'routes/components/dataTable';
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import { formatCurrency, formatPercentage } from 'utils/format';

import { styles } from './efficiencyTable.styles';

interface EfficiencyTableOwnProps {
  basePath?: string;
  exclude?: any;
  filterBy?: any;
  groupBy: string;
  isLoading?: boolean;
  onSort(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  report: OcpReport;
}

type EfficiencyTableProps = EfficiencyTableOwnProps;

const EfficiencyTable: React.FC<EfficiencyTableProps> = ({
  basePath,
  exclude,
  filterBy,
  groupBy,
  isLoading,
  onSort,
  orderBy,
  report,
}) => {
  const intl = useIntl();
  const location = useLocation();

  // Compute items and columns from report only (no location dependency)
  const computedItems = useMemo(() => {
    if (!report) {
      return [];
    }
    return getUnsortedComputedReportItems<OcpReport, OcpReportItem>({
      report,
      idKey: groupBy as any,
    });
  }, [report, groupBy]);

  const columns = useMemo(() => {
    return [
      {
        orderBy: groupBy,
        name: intl.formatMessage(messages.detailsResourceNames, { value: groupBy }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        orderBy: 'usage_efficiency',
        name: intl.formatMessage(messages.workloadEfficiency),
        ...(computedItems.length && { isSortable: true }),
        style: styles.column,
      },
      {
        orderBy: 'wasted_cost',
        name: intl.formatMessage(messages.wastedCost),
        ...(computedItems.length && { isSortable: true }),
        style: styles.column,
      },
      {
        orderBy: 'cost',
        name: intl.formatMessage(messages.totalCost),
        ...(computedItems.length && { isSortable: true }),
        style: styles.column,
      },
      {
        name: '',
        style: styles.column,
      },
    ];
  }, [computedItems, groupBy]);

  // Rows are computed fresh on every render so the Link state always uses
  // the current location — never a stale closure from a previous useMemo run.
  const rows = computedItems.map(item => {
    const label = item?.label !== null ? item.label : '';
    const desc = item?.id !== item.label ? <div style={styles.infoDescription}>{item.id}</div> : null;

    const name = (
      <Link
        to={basePath}
        replace
        state={{
          ...(location.state || {}),
          efficiencyState: {
            ...(location.state?.efficiencyState || {}),
            activeTabKey: 1, // Optimizations tab should be active when navigating back
          },
          optimizationsDetailsState: {
            ...(location.state?.optimizationsState || {}),
            filter_by: {
              [groupBy]: [label], // Filter by cluster or project name
            },
          },
        }}
      >
        {label}
      </Link>
    );

    return {
      cells: [
        {
          value: (
            <>
              {name}
              {desc}
            </>
          ),
        },
        {
          value: intl.formatMessage(messages.percent, {
            value: formatPercentage(item.score?.usage_efficiency_percent),
          }),
          style: styles.column,
        },
        {
          value: formatCurrency(item.score?.wasted_cost?.value || 0, item.score?.wasted_cost?.units || 'USD'),
          style: styles.column,
        },
        {
          value: formatCurrency(item.cost?.total?.value || 0, item.cost?.total?.units || 'USD'),
          style: styles.column,
        },
        { value: '', style: styles.column },
      ],
      item,
    };
  });

  return (
    <DataTable
      columns={columns}
      exclude={exclude}
      filterBy={filterBy}
      // gridBreakPoint={width < 300 ? 'grid' : undefined}
      gridBreakPoint="grid-md"
      isLoading={isLoading}
      // isNoWrapCell={false}
      isNoWrapHeader={false}
      // isNoPadding
      onSort={onSort}
      orderBy={orderBy}
      rows={rows}
    />
  );
};

export { EfficiencyTable };

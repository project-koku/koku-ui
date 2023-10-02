import 'routes/components/dataTable/dataTable.scss';

import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import type { Query } from 'api/queries/query';
import type { RecommendationReport } from 'api/ros/recommendations';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { DataTable } from 'routes/components/dataTable';
import { styles } from 'routes/components/dataTable/dataTable.styles';
import { NoOptimizationsState } from 'routes/components/page/noOptimizations/noOptimizationsState';
import { getOptimizationsBreakdownPath } from 'routes/utils/paths';
import { getTimeFromNow } from 'utils/dates';
import { hasWarning } from 'utils/recomendations';

interface OptimizationsTableOwnProps {
  basePath?: string;
  breadcrumbLabel?: string;
  breadcrumbPath?: string;
  filterBy?: any;
  groupBy?: string;
  isLoading?: boolean;
  onSort(value: string, isSortAscending: boolean);
  orderBy?: any;
  query?: Query;
  report: RecommendationReport;
  reportQueryString: string;
}

type OptimizationsTableProps = OptimizationsTableOwnProps;

const OptimizationsTable: React.FC<OptimizationsTableProps> = ({
  basePath,
  breadcrumbLabel,
  breadcrumbPath,
  filterBy,
  groupBy,
  isLoading,
  onSort,
  orderBy,
  query,
  report,
}) => {
  const intl = useIntl();
  const location = useLocation();

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const initDatum = () => {
    if (!report) {
      return;
    }
    const hasData = report && report.data && report.data.length > 0;

    const newRows = [];
    const newColumns = [
      {
        name: intl.formatMessage(messages.optimizationsNames, { value: 'container' }),
        orderBy: 'container',
        ...(hasData && { isSortable: true }),
      },
      {
        hidden: groupBy === 'project',
        name: intl.formatMessage(messages.optimizationsNames, { value: 'project' }),
        orderBy: 'project',
        ...(hasData && { isSortable: true }),
      },
      {
        name: intl.formatMessage(messages.optimizationsNames, { value: 'workload' }),
        orderBy: 'workload',
        ...(hasData && { isSortable: true }),
      },
      {
        name: intl.formatMessage(messages.optimizationsNames, { value: 'workload_type' }),
        orderBy: 'workload_type',
        ...(hasData && { isSortable: true }),
      },
      {
        hidden: groupBy === 'cluster',
        name: intl.formatMessage(messages.optimizationsNames, { value: 'cluster' }),
        orderBy: 'cluster',
        ...(hasData && { isSortable: true }),
      },
      {
        name: intl.formatMessage(messages.optimizationsNames, { value: 'last_reported' }),
        orderBy: 'last_reported',
        style: styles.lastItemColumn,
        ...(hasData && { isSortable: true }),
      },
    ];

    hasData &&
      report.data.map(item => {
        const cluster = item.cluster_alias ? item.cluster_alias : item.cluster_uuid ? item.cluster_uuid : '';
        const container = item.container ? item.container : '';
        const lastReported = getTimeFromNow(item.last_reported);
        const project = item.project ? item.project : '';
        const workload = item.workload ? item.workload : '';
        const workloadType = item.workload_type ? item.workload_type : '';
        const showWarningIcon = hasWarning(item?.recommendations?.duration_based);

        newRows.push({
          cells: [
            {
              value: (
                <Link
                  to={getOptimizationsBreakdownPath({
                    basePath,
                    breadcrumbLabel,
                    id: item.id,
                    title: container,
                  })}
                  state={{
                    ...(location.state && location.state),
                    optimizations: {
                      ...query,
                      breadcrumbPath,
                    },
                  }}
                >
                  {container}
                </Link>
              ),
            },
            { value: project, hidden: groupBy === 'project' },
            { value: workload },
            { value: workloadType },
            {
              value: (
                <>
                  {cluster}
                  {showWarningIcon && (
                    <span style={styles.warningIcon}>
                      <ExclamationTriangleIcon color="orange" />
                    </span>
                  )}
                </>
              ),
              hidden: groupBy === 'cluster',
            },
            { value: lastReported, style: styles.lastItem },
          ],
          optimization: {
            container: item.container,
            id: item.id,
            project,
          },
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

  const handleOnSort = (value: string, isSortAscending: boolean) => {
    if (onSort) {
      onSort(value, isSortAscending);
    }
  };

  useEffect(() => {
    initDatum();
  }, [report]);

  return (
    <DataTable
      columns={columns}
      emptyState={<NoOptimizationsState />}
      filterBy={filterBy}
      isLoading={isLoading}
      isSelectable={false}
      onSort={handleOnSort}
      orderBy={orderBy}
      rows={rows}
    />
  );
};

export { OptimizationsTable };

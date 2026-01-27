import 'routes/components/dataTable/dataTable.scss';

import { Icon } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import type { Query } from 'api/queries/query';
import type { RecommendationReport } from 'api/ros/recommendations';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { DataTable } from 'routes/components/dataTable';
import { styles } from 'routes/components/dataTable/dataTable.styles';
import { NoOptimizationsState } from 'routes/components/page/noOptimizations/noOptimizationsState';
import { getOptimizationsBreakdownPath } from 'routes/utils/paths';
import { getTimeFromNow } from 'utils/dates';
import { hasNotificationsWarning } from 'utils/notifications';

interface OptimizationsProjectOwnProps {
  breadcrumbLabel?: string;
  breadcrumbPath?: string;
  filterBy?: any;
  hideCluster?: boolean;
  hideProject?: boolean;
  isLoading?: boolean;
  isOptimizationsDetails?: boolean;
  linkPath?: string; // Optimizations breakdown link path
  linkState?: any; // Optimizations breakdown link state
  onSort(value: string, isSortAscending: boolean);
  orderBy?: any;
  projectPath?: string; // Project path (i.e., OCP details breakdown path)
  query?: Query;
  report: RecommendationReport;
  reportQueryString: string;
}

type OptimizationsProjectProps = OptimizationsProjectOwnProps;

const OptimizationsProjectTable: React.FC<OptimizationsProjectProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  filterBy,
  hideCluster,
  hideProject,
  isLoading,
  isOptimizationsDetails,
  linkPath,
  linkState,
  onSort,
  orderBy,
  projectPath,
  query,
  report,
}) => {
  const intl = useIntl();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const initDatum = () => {
    if (!report) {
      return;
    }
    const hasData = report?.data && report.data.length > 0;

    const newRows = [];
    const newColumns = [
      {
        name: intl.formatMessage(messages.optimizationsNames, { value: 'container' }),
        orderBy: 'container',
        ...(hasData && { isSortable: true }),
      },
      {
        hidden: hideProject,
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
        hidden: hideCluster,
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

    report?.data.map(item => {
      const cluster = item.cluster_alias ? item.cluster_alias : item.cluster_uuid ? item.cluster_uuid : '';
      const container = item.container ? item.container : '';
      const lastReported = getTimeFromNow(item.last_reported);
      const project = item.project ? item.project : '';
      const workload = item.workload ? item.workload : '';
      const workloadType = item.workload_type ? item.workload_type : '';
      const showWarningIcon = hasNotificationsWarning(item?.recommendations, true);

      const optimizationsBreakdownPath = getOptimizationsBreakdownPath({
        basePath: linkPath,
        breadcrumbLabel,
        id: item.id,
        isOptimizationsDetails,
        title: container,
      });

      const newLinkState = {
        ...(linkState && linkState),
        // OCP details breakdown page
        details: {
          ...(linkState?.details && linkState?.details),
          ...(projectPath && {
            breadcrumbPath: optimizationsBreakdownPath, // Path back to optimizations breakdown page
          }),
        },
        // Optimizations page
        optimizations: {
          ...(linkState?.optimizations && linkState?.optimizations),
          ...(isOptimizationsDetails && {
            ...query,
            breadcrumbPath, // Path back to optimizations details page
          }),
          ...(projectPath && { projectPath }), // Path to OCP details breakdown page
        },
        // Optimizations breakdown page
        optimizationsBreakdown: {
          ...(linkState?.optimizationsBreakdown && linkState?.optimizationsBreakdown),
          ...(!isOptimizationsDetails && {
            ...query,
            breadcrumbPath, // Path back to optimizations details page
          }),
        },
      };

      newRows.push({
        cells: [
          {
            value: (
              <Link to={optimizationsBreakdownPath} state={newLinkState}>
                {container}
              </Link>
            ),
          },
          { value: project, hidden: hideProject },
          { value: workload },
          { value: workloadType },
          {
            value: (
              <>
                {cluster}
                {showWarningIcon && (
                  <span style={styles.warningIcon}>
                    <Icon status="warning">
                      <ExclamationTriangleIcon />
                    </Icon>
                  </span>
                )}
              </>
            ),
            hidden: hideCluster,
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
    <>
      PROJECT TABLE
      <DataTable
        columns={columns}
        emptyState={<NoOptimizationsState />}
        filterBy={filterBy}
        isLoading={isLoading}
        onSort={handleOnSort}
        orderBy={orderBy}
        rows={rows}
      />
    </>
  );
};

export { OptimizationsProjectTable };

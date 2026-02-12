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

import { getRequestProps } from './utils';
import { getLinkState } from './utils';

interface OptimizationsProjectTableOwnProps {
  breadcrumbLabel?: string;
  breadcrumbPath?: string;
  filterBy?: any;
  isClusterHidden?: boolean;
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

type OptimizationsProjectTableProps = OptimizationsProjectTableOwnProps;

const OptimizationsProjectsDataTable: React.FC<OptimizationsProjectTableProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  filterBy,
  isClusterHidden,
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
  const [nestedColumns, setNestedColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const initDatum = () => {
    if (!report) {
      return;
    }
    const hasData = report?.data && report.data.length > 0;

    const newNestedColumns = [
      {
        colSpan: 1 + (isClusterHidden ? 0 : 1),
        hasRightBorder: true,
      },
      {
        colSpan: 2,
        hasRightBorder: true,
        name: intl.formatMessage(messages.optimizationsNames, { value: 'memory' }),
      },
      {
        colSpan: 2,
        hasRightBorder: true,
        name: intl.formatMessage(messages.optimizationsNames, { value: 'cpu' }),
      },
      {
        isSubheader: true,
        name: intl.formatMessage(messages.optimizationsNames, { value: 'last_reported' }),
        orderBy: 'last_reported',
        rowSpan: 2,
        style: styles.lastItemColumn,
        ...(hasData && { isSortable: true }),
      },
    ];

    const newRows = [];
    const newColumns = [
      {
        isSubheader: true,
        name: intl.formatMessage(messages.optimizationsNames, { value: 'project' }),
        orderBy: 'project',
        ...(hasData && { isSortable: true }),
      },
      {
        isSubheader: true,
        hasRightBorder: true,
        hidden: isClusterHidden,
        name: intl.formatMessage(messages.optimizationsNames, { value: 'cluster' }),
        orderBy: 'cluster',
        ...(hasData && { isSortable: true }),
      },
      {
        isSubheader: true,
        name: intl.formatMessage(messages.optimizationsNames, { value: 'current' }),
        orderBy: 'memory_current_request',
        ...(hasData && { isSortable: true }),
      },
      {
        isSubheader: true,
        hasRightBorder: true,
        name: intl.formatMessage(messages.optimizationsNames, { value: 'change' }),
        orderBy: 'memory_variation',
        ...(hasData && { isSortable: true }),
      },
      {
        isSubheader: true,
        name: intl.formatMessage(messages.optimizationsNames, { value: 'current' }),
        orderBy: 'cpu_current_request',
        ...(hasData && { isSortable: true }),
      },
      {
        isSubheader: true,
        hasRightBorder: true,
        name: intl.formatMessage(messages.optimizationsNames, { value: 'change' }),
        orderBy: 'cpu_variation',
        ...(hasData && { isSortable: true }),
      },
    ];
    report?.data.map(item => {
      const cluster = item.cluster_alias ?? item.cluster_uuid ?? '';
      const container = item.container ?? '';
      const lastReported = getTimeFromNow(item.last_reported);
      const project = item.project ?? '';
      const showWarningIcon = hasNotificationsWarning(item?.recommendations, true);

      const optimizationsBreakdownPath = getOptimizationsBreakdownPath({
        basePath: linkPath,
        breadcrumbLabel,
        // id: item.id, Todo: for testing
        id: '91b2a9dc-9143-4f67-9d2a-8fc3bd998183',
        isOptimizationsDetails,
        title: container,
      });

      const newLinkState = getLinkState({
        breadcrumbPath,
        isOptimizationsDetails,
        linkState,
        projectPath,
        optimizationsBreakdownPath,
        query,
      });

      const requestProps = getRequestProps(item);

      newRows.push({
        cells: [
          {
            value: (
              <Link to={optimizationsBreakdownPath} state={newLinkState}>
                {project}
              </Link>
            ),
          },
          {
            hidden: isClusterHidden,
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
          },
          { value: requestProps?.memoryRequestCurrent },
          { value: requestProps?.memoryVariation },
          { value: requestProps?.cpuRequestCurrent },
          { value: requestProps?.cpuVariation },
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
    const filteredNestedColumns = (newNestedColumns as any[]).filter(column => !column.hidden);
    const filteredRows = newRows.map(({ ...row }) => {
      row.cells = row.cells.filter(cell => !cell.hidden);
      return row;
    });

    setColumns(filteredColumns);
    setNestedColumns(filteredNestedColumns);
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
      nestedColumns={nestedColumns}
      onSort={handleOnSort}
      orderBy={orderBy}
      rows={rows}
    />
  );
};

export { OptimizationsProjectsDataTable };

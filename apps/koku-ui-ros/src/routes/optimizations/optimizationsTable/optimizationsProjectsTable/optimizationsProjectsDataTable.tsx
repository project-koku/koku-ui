import 'routes/components/dataTable/dataTable.scss';

import { Icon } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import type { RecommendationReport } from 'api/ros/recommendations';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { DataTable } from 'routes/components/dataTable';
import { styles } from 'routes/components/dataTable/dataTable.styles';
import { NoOptimizationsState } from 'routes/components/page/noOptimizations/noOptimizationsState';
import { getOptimizationsBreakdownPath } from 'routes/utils/paths';
import { Interval, OptimizationType } from 'utils/commonTypes';
import { getTimeFromNow } from 'utils/dates';
import { hasNotificationsWarning } from 'utils/notifications';

import { getRequestProps } from '../utils';

interface OptimizationsProjectTableOwnProps {
  breadcrumbLabel?: string;
  filterBy?: any;
  interval?: Interval;
  isClusterHidden?: boolean;
  isLoading?: boolean;
  linkPath?: string; // Optimizations breakdown link path
  linkState?: any; // Optimizations breakdown link state
  onSort(value: string, isSortAscending: boolean);
  optimizationType?: OptimizationType;
  orderBy?: any;
  projectPath?: string; // Project path (i.e., OCP details breakdown path)
  report: RecommendationReport;
  reportQueryString: string;
}

type OptimizationsProjectTableProps = OptimizationsProjectTableOwnProps;

const OptimizationsProjectsDataTable: React.FC<OptimizationsProjectTableProps> = ({
  breadcrumbLabel,
  filterBy,
  interval = Interval.short_term,
  isClusterHidden,
  isLoading,
  linkPath,
  linkState,
  onSort,
  optimizationType = OptimizationType.performance,
  orderBy,
  report,
}) => {
  const intl = useIntl();

  const [columns, setColumns] = useState([]);
  const [nestedColumns, setNestedColumns] = useState([]);
  const [rows, setRows] = useState([]);

  // Getters

  // Available values -- see https://github.com/RedHatInsights/ros-ocp-backend/blob/main/openapi.json
  //
  // cpu_variation_short_cost
  // cpu_variation_short_performance
  // cpu_variation_medium_cost
  // cpu_variation_medium_performance
  // cpu_variation_long_cost
  // cpu_variation_long_performance
  //
  // memory_variation_short_cost
  // memory_variation_short_performance
  // memory_variation_medium_cost
  // memory_variation_medium_performance
  // memory_variation_long_cost
  // memory_variation_long_performance
  const getOrderBy = (value: 'cpu_variation' | 'memory_variation') => {
    let result = value;

    if (interval === Interval.short_term) {
      result += '_short';
    } else if (interval === Interval.medium_term) {
      result += '_medium';
    } else if (interval === Interval.long_term) {
      result += '_long';
    }

    if (optimizationType === OptimizationType.cost) {
      result += '_cost';
    } else if (optimizationType === OptimizationType.performance) {
      result += '_performance';
    }
    return result;
  };

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
        orderBy: 'memory_request_current',
        ...(hasData && { isSortable: true }),
      },
      {
        isSubheader: true,
        hasRightBorder: true,
        name: intl.formatMessage(messages.optimizationsNames, { value: 'change' }),
        orderBy: getOrderBy('memory_variation'),
        ...(hasData && { isSortable: true }),
      },
      {
        isSubheader: true,
        name: intl.formatMessage(messages.optimizationsNames, { value: 'current' }),
        orderBy: 'cpu_request_current',
        ...(hasData && { isSortable: true }),
      },
      {
        isSubheader: true,
        hasRightBorder: true,
        name: intl.formatMessage(messages.optimizationsNames, { value: 'change' }),
        orderBy: getOrderBy('cpu_variation'),
        ...(hasData && { isSortable: true }),
      },
    ];

    report?.data?.forEach(item => {
      const cluster = item.cluster_alias ?? item.cluster_uuid ?? '';
      const container = item.container ?? '';
      const lastReported = getTimeFromNow(item.last_reported);
      const project = item.project ?? '';
      const showWarningIcon = hasNotificationsWarning(item?.recommendations, true);

      const optimizationsBreakdownPath = getOptimizationsBreakdownPath({
        basePath: linkPath,
        breadcrumbLabel,
        id: item.id,
        title: container,
      });

      const requestProps = getRequestProps(
        item?.recommendations?.recommendation_terms?.[interval]?.recommendation_engines?.[optimizationType]
      );

      newRows.push({
        cells: [
          {
            value: (
              <Link to={optimizationsBreakdownPath} state={linkState}>
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
          { value: requestProps?.memoryRequestVariation },
          { value: requestProps?.cpuRequestCurrent },
          { value: requestProps?.cpuRequestVariation },
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

  // Handlers

  const handleOnSort = (value: string, isSortAscending: boolean) => {
    if (onSort) {
      onSort(value, isSortAscending);
    }
  };

  // Effects

  useEffect(() => {
    initDatum();
  }, [interval, linkState, optimizationType, report]);

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

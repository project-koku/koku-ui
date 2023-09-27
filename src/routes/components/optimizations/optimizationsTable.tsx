import 'routes/components/dataTable/dataTable.scss';

import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import type { RecommendationReport } from 'api/ros/recommendations';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { DataTable } from 'routes/components/dataTable';
import { styles } from 'routes/components/dataTable/dataTable.styles';
import { NoOptimizationsState } from 'routes/components/page/noOptimizations/noOptimizationsState';
import { getGroupById } from 'routes/utils/groupBy';
import { getOptimizationsBreakdownPath } from 'routes/utils/paths';
import { createMapStateToProps } from 'store/common';
import { uiActions, uiSelectors } from 'store/ui';
import { getTimeFromNow } from 'utils/dates';
import { formatPath } from 'utils/paths';
import { hasWarning } from 'utils/recomendations';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface OptimizationsTableOwnProps extends RouterComponentProps {
  filterBy?: any;
  isLoading?: boolean;
  onSort(value: string, isSortAscending: boolean);
  orderBy?: any;
  query?: Query;
  report: RecommendationReport;
  reportQueryString: string;
}

interface OptimizationsTableState {
  currentRow?: number;
  columns?: any[];
  rows?: any[];
}

interface OptimizationsTableStateProps {
  groupBy?: string;
  isOpen?: boolean;
}

interface OptimizationsTableDispatchProps {
  closeOptimizationsDrawer: typeof uiActions.closeOptimizationsDrawer;
  openOptimizationsDrawer: typeof uiActions.openOptimizationsDrawer;
}

type OptimizationsTableProps = OptimizationsTableOwnProps &
  OptimizationsTableStateProps &
  OptimizationsTableDispatchProps &
  WrappedComponentProps;

class OptimizationsTableBase extends React.Component<OptimizationsTableProps, OptimizationsTableState> {
  public state: OptimizationsTableState = {
    columns: [],
    rows: [],
  };

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: OptimizationsTableProps) {
    const { report } = this.props;
    const currentReport = report && report.data ? JSON.stringify(report.data) : '';
    const previousReport = prevProps.report && prevProps.report.data ? JSON.stringify(prevProps.report.data) : '';

    if (previousReport !== currentReport) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const { groupBy, intl, query, report } = this.props;
    if (!report) {
      return;
    }

    const hasData = report && report.data && report.data.length > 0;

    const rows = [];
    const columns = [
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

        rows.push({
          cells: [
            {
              value: (
                <Link
                  to={getOptimizationsBreakdownPath({
                    basePath: formatPath(routes.optimizationsBreakdown.path),
                    id: item.id,
                    query,
                    title: container,
                  })}
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

    const filteredColumns = (columns as any[]).filter(column => !column.hidden);
    const filteredRows = rows.map(({ ...row }) => {
      row.cells = row.cells.filter(cell => !cell.hidden);
      return row;
    });

    this.setState({
      columns: filteredColumns,
      rows: filteredRows,
    });
  };

  private handleOnSort = (value: string, isSortAscending: boolean) => {
    const { closeOptimizationsDrawer, onSort } = this.props;

    closeOptimizationsDrawer();
    if (onSort) {
      onSort(value, isSortAscending);
    }
  };

  public render() {
    const { filterBy, isLoading, orderBy } = this.props;
    const { columns, rows } = this.state;

    return (
      <DataTable
        columns={columns}
        emptyState={<NoOptimizationsState />}
        filterBy={filterBy}
        isLoading={isLoading}
        isOptimizations
        isSelectable={false}
        onSort={this.handleOnSort}
        orderBy={orderBy}
        rows={rows}
      />
    );
  }
}

const mapStateToProps = createMapStateToProps<OptimizationsTableOwnProps, OptimizationsTableStateProps>(
  (state, { router }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);

    return {
      groupBy: getGroupById(queryFromRoute),
      isOpen: uiSelectors.selectIsOptimizationsDrawerOpen(state),
    };
  }
);

const mapDispatchToProps: OptimizationsTableDispatchProps = {
  closeOptimizationsDrawer: uiActions.closeOptimizationsDrawer,
  openOptimizationsDrawer: uiActions.openOptimizationsDrawer,
};

const OptimizationsTable = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(OptimizationsTableBase)));

export { OptimizationsTable };

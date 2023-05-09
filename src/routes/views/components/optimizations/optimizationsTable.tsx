import 'routes/views/details/components/dataTable/dataTable.scss';

import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import type { RosReport } from 'api/ros/ros';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { DataTable } from 'routes/views/details/components/dataTable';
import { styles } from 'routes/views/details/components/dataTable/dataTable.styles';
import { getGroupById } from 'routes/views/utils/groupBy';
import { createMapStateToProps } from 'store/common';
import { uiActions, uiSelectors } from 'store/ui';
import { getTimeFromNow } from 'utils/dates';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface OptimizationsTableOwnProps extends RouterComponentProps {
  isLoading?: boolean;
  onSort(value: string, isSortAscending: boolean);
  report: RosReport;
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
    const { groupBy, intl, report } = this.props;
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

        rows.push({
          cells: [
            { value: container },
            { value: project, hidden: groupBy === 'project' },
            { value: workload },
            { value: workloadType },
            { value: cluster, hidden: groupBy === 'cluster' },
            { value: lastReported, style: styles.lastItem },
          ],
          optimization: {
            container: item.container,
            id: item.id,
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

  private handleOnRowClick = (event: React.KeyboardEvent | React.MouseEvent, rowIndex: number) => {
    const { closeOptimizationsDrawer, isOpen, openOptimizationsDrawer } = this.props;
    const { currentRow, rows } = this.state;

    this.setState({ currentRow: rowIndex }, () => {
      if (currentRow === rowIndex && isOpen) {
        closeOptimizationsDrawer();
      } else {
        openOptimizationsDrawer(rows[rowIndex].optimization);
      }
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
    const { isLoading } = this.props;
    const { columns, rows } = this.state;

    return (
      <DataTable
        columns={columns}
        isLoading={isLoading}
        isOptimizations
        onSort={this.handleOnSort}
        rows={rows}
        onRowClick={this.handleOnRowClick}
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

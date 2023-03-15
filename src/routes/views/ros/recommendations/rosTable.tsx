import 'routes/views/details/components/dataTable/dataTable.scss';

import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import type { RhelReport } from 'api/reports/rhelReports';
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
import { getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface RosTableOwnProps extends RouterComponentProps {
  isLoading?: boolean;
  onSort(value: string, isSortAscending: boolean);
  report: RhelReport;
  reportQueryString: string;
}

interface RosTableState {
  columns?: any[];
  rows?: any[];
}

interface RosTableStateProps {
  groupBy?: string;
  isOpen?: boolean;
}

interface RosTableDispatchProps {
  closeRecommendationsDrawer: typeof uiActions.closeRecommendationsDrawer;
  openRecommendationsDrawer: typeof uiActions.openRecommendationsDrawer;
}

type RosTableProps = RosTableOwnProps & RosTableStateProps & RosTableDispatchProps & WrappedComponentProps;

class RosTableBase extends React.Component<RosTableProps> {
  public state: RosTableState = {
    columns: [],
    rows: [],
  };

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: RosTableProps) {
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

    const rows = [];
    const computedItems = getUnsortedComputedReportItems({
      report,
      idKey: 'project' as any, // Todo: getUnsortedComputedReportItems required for fake data.
    });

    const columns = [
      {
        name: intl.formatMessage(messages.recommendationsNames, { value: 'container' }),
        orderBy: 'container',
        ...(computedItems.length && { isSortable: true }),
      },
      {
        hidden: groupBy === 'project',
        name: intl.formatMessage(messages.recommendationsNames, { value: 'project' }),
        orderBy: 'project',
        ...(computedItems.length && { isSortable: true }),
      },
      {
        name: intl.formatMessage(messages.recommendationsNames, { value: 'workload' }),
        orderBy: 'workload',
        ...(computedItems.length && { isSortable: true }),
      },
      {
        name: intl.formatMessage(messages.recommendationsNames, { value: 'workload_type' }),
        orderBy: 'workload_type',
        ...(computedItems.length && { isSortable: true }),
      },
      {
        hidden: groupBy === 'cluster',
        name: intl.formatMessage(messages.recommendationsNames, { value: 'cluster' }),
        orderBy: 'cluster',
        ...(computedItems.length && { isSortable: true }),
      },
      {
        name: intl.formatMessage(messages.recommendationsNames, { value: 'last_reported' }),
        orderBy: 'last_reported',
        style: styles.lastReportedColumn,
        ...(computedItems.length && { isSortable: true }),
      },
    ];

    computedItems.map((item, index) => {
      const cluster = item && item.clusters !== null ? item.clusters[0] : '';
      const container = `Container${index}`;
      const lastReported = `6 hours ago`;
      const project = item && item.label !== null ? item.label : '';
      const workload = `Workload${index}`;
      const workloadType = `Workload type${index}`;

      rows.push({
        cells: [
          { value: <div>{container}</div> },
          { value: <div>{project}</div>, hidden: groupBy === 'project' },
          { value: <div>{workload}</div> },
          { value: <div>{workloadType}</div> },
          { value: <div>{cluster}</div>, hidden: groupBy === 'cluster' },
          { value: <div>{lastReported}</div>, style: styles.lastReported },
        ],
        item: {
          cluster,
          container,
          lastReported,
          project,
          workload,
          workloadType,
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
    const { openRecommendationsDrawer } = this.props;
    const { rows } = this.state;

    openRecommendationsDrawer(rows[rowIndex].item);
  };

  public render() {
    const { isLoading, onSort } = this.props;
    const { columns, rows } = this.state;

    return (
      <DataTable
        columns={columns}
        isLoading={isLoading}
        isRos
        onSort={onSort}
        rows={rows}
        onRowClick={this.handleOnRowClick}
      />
    );
  }
}

const mapStateToProps = createMapStateToProps<RosTableOwnProps, RosTableStateProps>((state, { router }) => {
  const queryFromRoute = parseQuery<Query>(router.location.search);

  return {
    groupBy: getGroupById(queryFromRoute),
    isOpen: uiSelectors.selectIsRecommendationsDrawerOpen(state),
  };
});

const mapDispatchToProps: RosTableDispatchProps = {
  closeRecommendationsDrawer: uiActions.closeRecommendationsDrawer,
  openRecommendationsDrawer: uiActions.openRecommendationsDrawer,
  // authRequest: (...args) => dispatch(authRequest(...args)),
};

const RosTable = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(RosTableBase)));

export { RosTable };

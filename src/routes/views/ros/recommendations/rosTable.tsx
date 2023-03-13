import 'routes/views/details/components/dataTable/dataTable.scss';

import type { RhelReport } from 'api/reports/rhelReports';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { DataTable } from 'routes/views/details/components/dataTable';
import { styles } from 'routes/views/details/components/dataTable/dataTable.styles';
import { getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface RosTableOwnProps extends RouterComponentProps, WrappedComponentProps {
  isLoading?: boolean;
  onSort(value: string, isSortAscending: boolean);
  report: RhelReport;
  reportQueryString: string;
}

interface RosTableState {
  columns?: any[];
  rows?: any[];
}

type RosTableProps = RosTableOwnProps;

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
    const { intl, report } = this.props;
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
        ...(computedItems.length && { isSortable: true }),
        name: intl.formatMessage(messages.clusters, { count: 1 }),
        orderBy: 'cluster',
      },
      {
        ...(computedItems.length && { isSortable: true }),
        name: intl.formatMessage(messages.project),
        orderBy: 'project',
      },
      {
        ...(computedItems.length && { isSortable: true }),
        name: intl.formatMessage(messages.workloadType),
        orderBy: 'workload_type',
      },
      {
        ...(computedItems.length && { isSortable: true }),
        name: intl.formatMessage(messages.workload),
        orderBy: 'workload',
      },
      {
        ...(computedItems.length && { isSortable: true }),
        name: intl.formatMessage(messages.container),
        orderBy: 'container',
      },
      {
        ...(computedItems.length && { isSortable: true }),
        name: intl.formatMessage(messages.lastReported),
        orderBy: 'last_reported',
        style: styles.lastReportedColumn,
      },
    ];

    computedItems.map((item, index) => {
      const label = item && item.label !== null ? item.label : '';

      rows.push({
        cells: [
          { value: <div>{`Cluster${index}`}</div> },
          { value: <div>{label}</div> },
          { value: <div>{`Workload type${index}`}</div> },
          { value: <div>{`Workload${index}`}</div> },
          { value: <div>{`Container${index}`}</div> },
          { value: <div>{`6 hours ago`}</div>, style: styles.lastReportedCell },
        ],
        item,
      });
    });

    this.setState({
      columns,
      rows,
    });
  };

  public render() {
    const { isLoading, onSort } = this.props;
    const { columns, rows } = this.state;

    return <DataTable columns={columns} isLoading={isLoading} isRos onSort={onSort} rows={rows} />;
  }
}

const RosTable = injectIntl(withRouter(RosTableBase));

export { RosTable };
export type { RosTableProps };

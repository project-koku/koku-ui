import { css } from '@patternfly/react-styles';
import { getQuery, OcpOnAwsQuery } from 'api/ocpOnAwsQuery';
import { OcpOnAwsReport, OcpOnAwsReportType } from 'api/ocpOnAwsReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  ocpOnAwsReportsActions,
  ocpOnAwsReportsSelectors,
} from 'store/ocpOnAwsReports';
import {
  ComputedOcpOnAwsReportItem,
  getComputedOcpOnAwsReportItems,
} from 'utils/getComputedOcpOnAwsReportItems';
import { styles } from './detailsCluster.styles';

interface DetailsClusterOwnProps {
  groupBy: string;
  item: ComputedOcpOnAwsReportItem;
}

interface DetailsClusterStateProps {
  query?: OcpOnAwsQuery;
  queryString?: string;
  report?: OcpOnAwsReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsClusterDispatchProps {
  fetchReport?: typeof ocpOnAwsReportsActions.fetchReport;
}

type DetailsClusterProps = DetailsClusterOwnProps &
  DetailsClusterStateProps &
  DetailsClusterDispatchProps &
  InjectedTranslateProps;

const reportType = OcpOnAwsReportType.cost;

class DetailsClusterBase extends React.Component<DetailsClusterProps> {
  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsClusterProps) {
    const { fetchReport, queryString } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportType, queryString);
    }
  }

  private getItems() {
    const { report } = this.props;
    const computedItems = getComputedOcpOnAwsReportItems({
      report,
      idKey: 'cluster',
    });

    return computedItems;
  }

  public render() {
    const items = this.getItems();
    const clusterName = items && items.length ? items[0].label : '';

    return <div className={css(styles.clusterContainer)}>{clusterName}</div>;
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsClusterOwnProps,
  DetailsClusterStateProps
>((state, { groupBy, item }) => {
  const query: OcpOnAwsQuery = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'monthly',
      limit: 5,
    },
    group_by: {
      cluster: '*',
      [groupBy]: item.label || item.id,
    },
  };
  const queryString = getQuery(query);
  const report = ocpOnAwsReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = ocpOnAwsReportsSelectors.selectReportFetchStatus(
    state,
    reportType,
    queryString
  );
  return {
    report,
    reportFetchStatus,
    query,
    queryString,
  };
});

const mapDispatchToProps: DetailsClusterDispatchProps = {
  fetchReport: ocpOnAwsReportsActions.fetchReport,
};

const DetailsCluster = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsClusterBase)
);

export { DetailsCluster, DetailsClusterProps };

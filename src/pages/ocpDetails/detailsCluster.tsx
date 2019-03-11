import { css } from '@patternfly/react-styles';
import { getQuery, OcpQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpReportsActions, ocpReportsSelectors } from 'store/ocpReports';
import {
  ComputedOcpReportItem,
  getComputedOcpReportItems,
} from 'utils/getComputedOcpReportItems';
import { styles } from './detailsCluster.styles';

interface DetailsClusterOwnProps {
  groupBy: string;
  item: ComputedOcpReportItem;
}

interface DetailsClusterStateProps {
  query?: OcpQuery;
  queryString?: string;
  report?: OcpReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsClusterDispatchProps {
  fetchReport?: typeof ocpReportsActions.fetchReport;
}

type DetailsClusterProps = DetailsClusterOwnProps &
  DetailsClusterStateProps &
  DetailsClusterDispatchProps &
  InjectedTranslateProps;

const reportType = OcpReportType.cost;

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
    const computedItems = getComputedOcpReportItems({
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
  const query: OcpQuery = {
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
  const report = ocpReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
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
  fetchReport: ocpReportsActions.fetchReport,
};

const DetailsCluster = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsClusterBase)
);

export { DetailsCluster, DetailsClusterProps };

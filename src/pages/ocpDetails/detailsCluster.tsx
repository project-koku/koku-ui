import { css } from '@patternfly/react-styles';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpReportsActions, ocpReportsSelectors } from 'store/ocpReports';
import { getComputedOcpReportItems } from 'utils/getComputedOcpReportItems';
import { styles } from './ocpDetails.styles';

interface DetailsClusterOwnProps {
  id?: string;
  idKey: any;
  label?: string;
  queryString: string;
}

interface DetailsClusterStateProps {
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

class DetailsClusterBase extends React.Component<DetailsClusterProps> {
  public componentDidMount() {
    const { report, queryString } = this.props;
    if (!report) {
      this.props.fetchReport(OcpReportType.charge, queryString);
    }
  }

  public componentDidUpdate(prevProps: DetailsClusterProps) {
    if (prevProps.queryString !== this.props.queryString) {
      this.props.fetchReport(OcpReportType.charge, this.props.queryString);
    }
  }

  private getItems() {
    const { report, idKey } = this.props;

    const computedItems = getComputedOcpReportItems({
      report,
      idKey,
    } as any);

    return computedItems;
  }

  public render() {
    const { id } = this.props;
    const items = this.getItems();
    const clusterName = items && items.length ? items[0].label : '';

    return (
      <div className={css(styles.clusterContainer)} id={id}>
        {clusterName}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsClusterOwnProps,
  DetailsClusterStateProps
>((state, { queryString }) => {
  const report = ocpReportsSelectors.selectReport(
    state,
    OcpReportType.charge,
    queryString
  );
  const reportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    OcpReportType.charge,
    queryString
  );
  return {
    report,
    reportFetchStatus,
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

export { DetailsCluster, DetailsClusterBase, DetailsClusterProps };

import { css } from '@patternfly/react-styles';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import {
  OcpReportSummaryItem,
  OcpReportSummaryItems,
} from 'components/ocpReportSummary';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpReportsActions, ocpReportsSelectors } from 'store/ocpReports';
import { formatValue } from 'utils/formatValue';
import { styles } from './ocpDetails.styles';

interface DetailsSummaryOwnProps {
  idKey: any;
  queryString: string;
  title?: string;
}

interface DetailsSummaryStateProps {
  report?: OcpReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsSummaryDispatchProps {
  fetchReport?: typeof ocpReportsActions.fetchReport;
}

type DetailsSummaryProps = DetailsSummaryOwnProps &
  DetailsSummaryStateProps &
  DetailsSummaryDispatchProps &
  InjectedTranslateProps;

class DetailsSummaryBase extends React.Component<DetailsSummaryProps> {
  public componentDidMount() {
    const { queryString, report } = this.props;
    if (!report) {
      this.props.fetchReport(OcpReportType.charge, queryString);
    }
  }

  public componentDidUpdate(prevProps: DetailsSummaryProps) {
    if (prevProps.queryString !== this.props.queryString) {
      this.props.fetchReport(OcpReportType.charge, this.props.queryString);
    }
  }

  public render() {
    const { idKey, report, title } = this.props;

    return (
      <div>
        {title}
        <div className={css(styles.projectsProgressBar)}>
          <OcpReportSummaryItems idKey={idKey} report={report}>
            {({ items }) =>
              items.map(reportItem => (
                <OcpReportSummaryItem
                  key={reportItem.id}
                  formatOptions={{}}
                  formatValue={formatValue}
                  label={reportItem.label.toString()}
                  totalValue={report.total.charge}
                  units={reportItem.units}
                  value={reportItem.charge}
                />
              ))
            }
          </OcpReportSummaryItems>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsSummaryOwnProps,
  DetailsSummaryStateProps
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

const mapDispatchToProps: DetailsSummaryDispatchProps = {
  fetchReport: ocpReportsActions.fetchReport,
};

const DetailsSummary = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsSummaryBase)
);

export { DetailsSummary, DetailsSummaryBase, DetailsSummaryProps };

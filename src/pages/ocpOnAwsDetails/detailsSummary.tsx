import { css } from '@patternfly/react-styles';
import { getQuery, OcpOnAwsQuery } from 'api/ocpOnAwsQuery';
import { OcpOnAwsReport, OcpOnAwsReportType } from 'api/ocpOnAwsReports';
import {
  OcpOnAwsReportSummaryItem,
  OcpOnAwsReportSummaryItems,
} from 'components/reports/ocpOnAwsReportSummary';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  ocpOnAwsReportsActions,
  ocpOnAwsReportsSelectors,
} from 'store/ocpOnAwsReports';
import { formatValue } from 'utils/formatValue';
import { ComputedOcpOnAwsReportItem } from 'utils/getComputedOcpOnAwsReportItems';
import { styles } from './detailsSummary.styles';

interface DetailsSummaryOwnProps {
  groupBy: string;
  item: ComputedOcpOnAwsReportItem;
}

interface DetailsSummaryStateProps {
  queryString?: string;
  report?: OcpOnAwsReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsSummaryDispatchProps {
  fetchReport?: typeof ocpOnAwsReportsActions.fetchReport;
}

type DetailsSummaryProps = DetailsSummaryOwnProps &
  DetailsSummaryStateProps &
  DetailsSummaryDispatchProps &
  InjectedTranslateProps;

const reportType = OcpOnAwsReportType.cost;

class DetailsSummaryBase extends React.Component<DetailsSummaryProps> {
  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsSummaryProps) {
    const { fetchReport, queryString } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportType, queryString);
    }
  }

  public render() {
    const { report, t } = this.props;

    return (
      <div>
        {t('group_by.top_ocp_on_aws', { groupBy: 'service' })}
        <div className={css(styles.summary)}>
          <OcpOnAwsReportSummaryItems idKey="project" report={report}>
            {({ items }) =>
              items.map(reportItem => (
                <OcpOnAwsReportSummaryItem
                  key={reportItem.id}
                  formatOptions={{}}
                  formatValue={formatValue}
                  label={reportItem.label.toString()}
                  totalValue={report.meta.total.cost.value}
                  units={reportItem.units}
                  value={reportItem.cost}
                />
              ))
            }
          </OcpOnAwsReportSummaryItems>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsSummaryOwnProps,
  DetailsSummaryStateProps
>((state, { groupBy, item }) => {
  const query: OcpOnAwsQuery = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'monthly',
      limit: 3,
    },
    group_by: {
      service: '*',
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
    queryString,
  };
});

const mapDispatchToProps: DetailsSummaryDispatchProps = {
  fetchReport: ocpOnAwsReportsActions.fetchReport,
};

const DetailsSummary = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsSummaryBase)
);

export { DetailsSummary, DetailsSummaryProps };

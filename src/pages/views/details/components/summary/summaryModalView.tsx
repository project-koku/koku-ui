import { Title } from '@patternfly/react-core';
import { getQuery, logicalAndPrefix, orgUnitIdKey, parseQuery, Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import { ReportSummaryItem, ReportSummaryItems } from 'components/reports/reportSummary';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'pages/views/utils/groupBy';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatValue } from 'utils/formatValue';
import { formatCurrency } from 'utils/formatValue';

import { styles } from './summaryModal.styles';

interface SummaryModalViewOwnProps {
  reportGroupBy?: string;
  reportPathsType: ReportPathsType;
}

interface SummaryModalViewStateProps {
  queryString?: string;
  report?: Report;
  reportFetchStatus?: FetchStatus;
}

interface SummaryModalViewDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type SummaryModalViewProps = SummaryModalViewOwnProps &
  SummaryModalViewStateProps &
  SummaryModalViewDispatchProps &
  WithTranslation;

const reportType = ReportType.cost;

class SummaryModalViewBase extends React.Component<SummaryModalViewProps> {
  constructor(props: SummaryModalViewProps) {
    super(props);
  }

  public componentDidMount() {
    const { fetchReport, queryString, reportPathsType } = this.props;
    fetchReport(reportPathsType, reportType, queryString);
  }

  public componentDidUpdate(prevProps: SummaryModalViewProps) {
    const { fetchReport, queryString, reportPathsType } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportPathsType, reportType, queryString);
    }
  }

  public render() {
    const { report, reportGroupBy, reportFetchStatus, t } = this.props;

    const cost = formatCurrency(report && report.meta && report.meta.total ? report.meta.total.cost.total.value : 0);

    return (
      <>
        <div style={styles.subTitle}>
          <Title headingLevel="h2" size="xl">
            {t('details.cost_value', { value: cost })}
          </Title>
        </div>
        <div style={styles.mainContent}>
          <ReportSummaryItems idKey={reportGroupBy as any} report={report} status={reportFetchStatus}>
            {({ items }) =>
              items.map(_item => (
                <ReportSummaryItem
                  key={_item.id}
                  formatOptions={{}}
                  formatValue={formatValue}
                  label={_item.label ? _item.label.toString() : ''}
                  totalValue={report.meta.total.cost.total.value}
                  units={report.meta.total.cost.total.units}
                  value={_item.cost.total.value}
                />
              ))
            }
          </ReportSummaryItems>
        </div>
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<SummaryModalViewOwnProps, SummaryModalViewStateProps>(
  (state, { reportGroupBy, reportPathsType }) => {
    const queryFromRoute = parseQuery<Query>(location.search);
    const query = queryFromRoute;
    const groupByOrgValue = getGroupByOrgValue(query);
    const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(query);
    const groupByValue = groupByOrgValue ? groupByOrgValue : getGroupByValue(query);

    const newQuery: Query = {
      filter: {
        resolution: 'monthly',
        time_scope_units: 'month',
        time_scope_value: -1,
      },
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...(query && query.filter && query.filter.account && { [`${logicalAndPrefix}account`]: query.filter.account }),
        ...(groupBy && { [`${logicalAndPrefix}${groupBy}`]: groupByValue }), // group bys must appear in filter to show costs by regions, accounts, etc
        ...(query && query.filter_by && query.filter_by),
      },
      group_by: {
        ...(reportGroupBy && { [reportGroupBy]: '*' }), // Group by specific account, project, etc.
      },
    };
    const queryString = getQuery(newQuery);
    const report = reportSelectors.selectReport(state, reportPathsType, reportType, queryString);
    const reportFetchStatus = reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, queryString);
    return {
      queryString,
      report,
      reportFetchStatus,
    };
  }
);

const mapDispatchToProps: SummaryModalViewDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const SummaryModalView = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(SummaryModalViewBase));

export { SummaryModalView, SummaryModalViewProps };

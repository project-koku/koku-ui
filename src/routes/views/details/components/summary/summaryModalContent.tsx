import { Title, TitleSizes } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQuery, parseQuery } from 'api/queries/query';
import type { Report, ReportPathsType } from 'api/reports/report';
import { ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ReportSummaryItem, ReportSummaryItems } from 'routes/views/components/reports/reportSummary';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'routes/views/utils/groupBy';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatCurrency } from 'utils/format';
import { logicalAndPrefix, orgUnitIdKey } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './summaryModal.styles';

interface SummaryModalContentOwnProps extends RouterComponentProps, WrappedComponentProps {
  costType?: string;
  currency?: string;
  reportGroupBy?: string;
  reportPathsType: ReportPathsType;
}

interface SummaryModalContentStateProps {
  report?: Report;
  reportFetchStatus?: FetchStatus;
  reportQueryString?: string;
}

interface SummaryModalContentDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type SummaryModalContentProps = SummaryModalContentOwnProps &
  SummaryModalContentStateProps &
  SummaryModalContentDispatchProps;

const reportType = ReportType.cost;

class SummaryModalContentBase extends React.Component<SummaryModalContentProps, any> {
  constructor(props: SummaryModalContentProps) {
    super(props);
  }

  public componentDidMount() {
    const { fetchReport, reportPathsType, reportQueryString } = this.props;
    fetchReport(reportPathsType, reportType, reportQueryString);
  }

  public componentDidUpdate(prevProps: SummaryModalContentProps) {
    const { fetchReport, reportPathsType, reportQueryString } = this.props;
    if (prevProps.reportQueryString !== reportQueryString) {
      fetchReport(reportPathsType, reportType, reportQueryString);
    }
  }

  public render() {
    const { intl, report, reportGroupBy, reportFetchStatus } = this.props;

    const hasTotal = report && report.meta && report.meta.total;
    const cost = formatCurrency(
      hasTotal ? report.meta.total.cost.total.value : 0,
      hasTotal ? report.meta.total.cost.total.units : 'USD'
    );

    return (
      <>
        <div style={styles.subTitle}>
          <Title headingLevel="h2" size={TitleSizes.xl}>
            {intl.formatMessage(messages.detailsCostValue, { value: cost })}
          </Title>
        </div>
        <div style={styles.mainContent}>
          <ReportSummaryItems idKey={reportGroupBy as any} report={report} status={reportFetchStatus}>
            {({ items }) =>
              items.map(_item => (
                <ReportSummaryItem
                  key={_item.id}
                  formatOptions={{}}
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

const mapStateToProps = createMapStateToProps<SummaryModalContentOwnProps, SummaryModalContentStateProps>(
  (state, { costType, currency, reportGroupBy, reportPathsType, router }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);
    const groupByOrgValue = getGroupByOrgValue(queryFromRoute);
    const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(queryFromRoute);
    const groupByValue = groupByOrgValue ? groupByOrgValue : getGroupByValue(queryFromRoute);

    const newQuery: Query = {
      filter: {
        resolution: 'monthly',
        time_scope_units: 'month',
        time_scope_value: -1,
      },
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...(queryFromRoute && queryFromRoute.filter_by && queryFromRoute.filter_by),
        ...(queryFromRoute &&
          queryFromRoute.filter &&
          queryFromRoute.filter.account && { [`${logicalAndPrefix}account`]: queryFromRoute.filter.account }),
        ...(queryFromRoute &&
          queryFromRoute.filter &&
          queryFromRoute.filter.category && { category: queryFromRoute.filter.category }),
        ...(groupBy && { [groupBy]: groupByValue }), // group bys must appear in filter to show costs by regions, accounts, etc
      },
      exclude: {
        ...(queryFromRoute && queryFromRoute.exclude && queryFromRoute.exclude),
      },
      group_by: {
        ...(reportGroupBy && { [reportGroupBy]: '*' }), // Group by specific account, project, etc.
      },
    };

    const reportQueryString = getQuery({
      ...newQuery,
      cost_type: costType,
      currency,
      filter_by: {
        ...newQuery.filter_by,
        // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
        ...(groupBy && groupByValue !== '*' && { [groupBy]: undefined }),
      },
    });
    const report = reportSelectors.selectReport(state, reportPathsType, reportType, reportQueryString);
    const reportFetchStatus = reportSelectors.selectReportFetchStatus(
      state,
      reportPathsType,
      reportType,
      reportQueryString
    );

    return {
      report,
      reportFetchStatus,
      reportQueryString,
    };
  }
);

const mapDispatchToProps: SummaryModalContentDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const SummaryModalContent = injectIntl(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(SummaryModalContentBase))
);

export { SummaryModalContent };
export type { SummaryModalContentProps };

import { Title, TitleSizes } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQuery, parseQuery, parseQueryState } from 'api/queries/query';
import type { Report, ReportPathsType } from 'api/reports/report';
import { ReportType } from 'api/reports/report';
import type { AxiosError } from 'axios';
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
import { logicalAndPrefix, logicalOrPrefix, orgUnitIdKey, platformCategoryKey } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './summaryModal.styles';

interface SummaryModalContentOwnProps extends RouterComponentProps, WrappedComponentProps {
  costDistribution: string;
  costType?: string;
  currency?: string;
  reportGroupBy?: string;
  reportPathsType: ReportPathsType;
}

interface SummaryModalContentStateProps {
  report?: Report;
  reportError?: AxiosError;
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
    this.updateReport();
  }

  public componentDidUpdate(prevProps: SummaryModalContentProps) {
    const { reportQueryString } = this.props;
    if (prevProps.reportQueryString !== reportQueryString) {
      this.updateReport();
    }
  }

  private updateReport = () => {
    const { fetchReport, reportQueryString, reportPathsType } = this.props;
    fetchReport(reportPathsType, reportType, reportQueryString);
  };

  public render() {
    const { costDistribution, intl, report, reportGroupBy, reportFetchStatus } = this.props;

    const hasTotal = report && report.meta && report.meta.total;
    const cost = formatCurrency(
      hasTotal ? report.meta.total.cost[costDistribution].value : 0,
      hasTotal ? report.meta.total.cost[costDistribution].units : 'USD'
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
                  totalValue={report.meta.total.cost[costDistribution].value}
                  units={report.meta.total.cost[costDistribution].units}
                  value={_item.cost[costDistribution].value}
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
    const queryState = parseQueryState<Query>(queryFromRoute);

    const groupByOrgValue = getGroupByOrgValue(queryFromRoute);
    const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(queryFromRoute);
    const groupByValue = groupByOrgValue ? groupByOrgValue : getGroupByValue(queryFromRoute);

    const reportQuery: Query = {
      cost_type: costType,
      currency,
      filter: {
        time_scope_units: 'month',
        time_scope_value: -1,
        resolution: 'monthly',
      },
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...(queryState && queryState.filter_by && queryState.filter_by),
        ...(queryFromRoute && queryFromRoute.isPlatformCosts && { category: platformCategoryKey }),
        ...(queryFromRoute &&
          queryFromRoute.filter &&
          queryFromRoute.filter.account && { [`${logicalAndPrefix}account`]: queryFromRoute.filter.account }),
        // Related to https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
        ...(groupBy && groupByValue !== '*' && { [groupBy]: groupByValue }), // group bys must appear in filter to show costs by region, account, etc
        // Workaround for https://issues.redhat.com/browse/COST-1189
        ...(queryState &&
          queryState.filter_by &&
          queryState.filter_by[orgUnitIdKey] && {
            [`${logicalOrPrefix}${orgUnitIdKey}`]: queryState.filter_by[orgUnitIdKey],
            [orgUnitIdKey]: undefined,
          }),
      },
      exclude: {
        ...(queryState && queryState.exclude && queryState.exclude),
      },
      group_by: {
        ...(reportGroupBy && { [reportGroupBy]: '*' }), // Group by specific account, project, etc.
      },
    };

    const reportQueryString = getQuery(reportQuery);
    const report = reportSelectors.selectReport(state, reportPathsType, reportType, reportQueryString);
    const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, reportQueryString);
    const reportFetchStatus = reportSelectors.selectReportFetchStatus(
      state,
      reportPathsType,
      reportType,
      reportQueryString
    );

    return {
      report,
      reportError,
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

import type { Query } from '@koku-ui/api/queries/query';
import { getQuery, parseQuery } from '@koku-ui/api/queries/query';
import type { Report, ReportPathsType } from '@koku-ui/api/reports/report';
import { ReportType } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
import { Title, TitleSizes } from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import type { FetchStatus } from '../../../../../store/common';
import { createMapStateToProps } from '../../../../../store/common';
import { reportActions, reportSelectors } from '../../../../../store/reports';
import { formatCurrency } from '../../../../../utils/format';
import { logicalAndPrefix, logicalOrPrefix, orgUnitIdKey, platformCategoryKey } from '../../../../../utils/props';
import type { RouterComponentProps } from '../../../../../utils/router';
import { withRouter } from '../../../../../utils/router';
import { ComputedReportItemValueType } from '../../../../components/charts/common';
import { ReportSummaryItem, ReportSummaryItems } from '../../../../components/reports/reportSummary';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from '../../../../utils/groupBy';
import { getQueryState } from '../../../../utils/queryState';
import { getTimeScopeValue } from '../../../../utils/timeScope';
import { styles } from './summaryModal.styles';

interface SummaryContentOwnProps extends RouterComponentProps, WrappedComponentProps {
  costDistribution: string;
  costType?: string;
  currency?: string;
  reportGroupBy?: string;
  reportPathsType: ReportPathsType;
}

interface SummaryContentStateProps {
  report?: Report;
  reportError?: AxiosError;
  reportFetchStatus?: FetchStatus;
  reportQueryString?: string;
}

interface SummaryContentDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type SummaryContentProps = SummaryContentOwnProps & SummaryContentStateProps & SummaryContentDispatchProps;

const reportType = ReportType.cost;

class SummaryContentBase extends React.Component<SummaryContentProps, any> {
  constructor(props: SummaryContentProps) {
    super(props);
  }

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: SummaryContentProps) {
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

    const reportItemValue = costDistribution ? costDistribution : ComputedReportItemValueType.total;
    const hasTotal = report?.meta?.total;
    const cost = formatCurrency(
      hasTotal ? report.meta.total.cost[reportItemValue].value : 0,
      hasTotal ? report.meta.total.cost[reportItemValue].units : 'USD'
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
                  totalValue={report.meta.total.cost[reportItemValue].value}
                  units={report.meta.total.cost[reportItemValue].units}
                  value={_item.cost[reportItemValue]?.value}
                />
              ))
            }
          </ReportSummaryItems>
        </div>
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<SummaryContentOwnProps, SummaryContentStateProps>(
  (state, { costDistribution, costType, currency, reportGroupBy, reportPathsType, router }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);
    const queryState = getQueryState(router.location, 'details');

    const groupByOrgValue = getGroupByOrgValue(queryFromRoute);
    const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(queryFromRoute);
    const groupByValue = groupByOrgValue || getGroupByValue(queryFromRoute);
    const timeScopeValue = getTimeScopeValue(queryState);

    const reportQuery: Query = {
      cost_type: costType,
      currency,
      filter: {
        resolution: 'monthly',
        time_scope_units: 'month',
        time_scope_value: timeScopeValue,
      },
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...(queryState?.filter_by && queryState.filter_by),
        ...(queryFromRoute?.isPlatformCosts && { category: platformCategoryKey }),
        ...(queryFromRoute?.filter?.account && { [`${logicalAndPrefix}account`]: queryFromRoute.filter.account }),
        // Related to https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
        ...(groupBy && groupByValue !== '*' && { [groupBy]: groupByValue }), // group bys must appear in filter to show costs by region, account, etc
        // Workaround for https://issues.redhat.com/browse/COST-1189
        ...(queryState?.filter_by &&
          queryState.filter_by[orgUnitIdKey] && {
            [`${logicalOrPrefix}${orgUnitIdKey}`]: queryState.filter_by[orgUnitIdKey],
            [orgUnitIdKey]: undefined,
          }),
      },
      exclude: {
        ...(queryState?.exclude && queryState.exclude),
      },
      group_by: {
        ...(reportGroupBy && { [reportGroupBy]: '*' }), // Group by specific account, project, etc.
      },
      ...(costDistribution === ComputedReportItemValueType.distributed && {
        order_by: {
          distributed_cost: 'desc',
        },
      }),
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

const mapDispatchToProps: SummaryContentDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const SummaryContent = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(SummaryContentBase)));

export { SummaryContent };
export type { SummaryContentProps };

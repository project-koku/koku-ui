import { Title, TitleSizes } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQuery, logicalAndPrefix, orgUnitIdKey, parseQuery } from 'api/queries/query';
import type { Report } from 'api/reports/report';
import { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ReportSummaryItem, ReportSummaryItems } from 'routes/views/components/reports/reportSummary';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'routes/views/utils/groupBy';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatCurrency } from 'utils/format';

import { styles } from './summaryModal.styles';

interface SummaryModalContentOwnProps {
  costType?: string;
  currency?: string;
  reportGroupBy?: string;
  reportPathsType: ReportPathsType;
}

interface SummaryModalContentStateProps {
  queryString?: string;
  report?: Report;
  reportFetchStatus?: FetchStatus;
}

interface SummaryModalContentDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type SummaryModalContentProps = SummaryModalContentOwnProps &
  SummaryModalContentStateProps &
  SummaryModalContentDispatchProps &
  WrappedComponentProps;

const reportType = ReportType.cost;

class SummaryModalContentBase extends React.Component<SummaryModalContentProps> {
  constructor(props: SummaryModalContentProps) {
    super(props);
  }

  public componentDidMount() {
    const { fetchReport, queryString, reportPathsType } = this.props;
    fetchReport(reportPathsType, reportType, queryString);
  }

  public componentDidUpdate(prevProps: SummaryModalContentProps) {
    const { fetchReport, queryString, reportPathsType } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportPathsType, reportType, queryString);
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
  (state, { costType, currency, reportGroupBy, reportPathsType }) => {
    const query = parseQuery<Query>(location.search);
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
        ...(query && query.filter_by && query.filter_by),
        ...(query && query.filter && query.filter.account && { [`${logicalAndPrefix}account`]: query.filter.account }),
        ...(groupBy && { [groupBy]: undefined }), // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131
        ...(groupBy && { [groupBy]: groupByValue }), // group bys must appear in filter to show costs by regions, accounts, etc
      },
      group_by: {
        ...(reportGroupBy && { [reportGroupBy]: '*' }), // Group by specific account, project, etc.
      },
      cost_type: costType,
      currency,
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

const mapDispatchToProps: SummaryModalContentDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const SummaryModalContent = injectIntl(connect(mapStateToProps, mapDispatchToProps)(SummaryModalContentBase));

export { SummaryModalContent };
export type { SummaryModalContentProps };

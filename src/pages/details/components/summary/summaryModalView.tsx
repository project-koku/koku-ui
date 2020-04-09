import { Title } from '@patternfly/react-core';
import { getQuery, Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import {
  ReportSummaryItem,
  ReportSummaryItems,
} from 'components/reports/reportSummary';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatValue } from 'utils/formatValue';
import { formatCurrency } from 'utils/formatValue';
import { styles } from './summaryModal.styles';

interface SummaryModalViewOwnProps {
  filterBy: string | number;
  groupBy: string;
  parentGroupBy: string;
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
  InjectedTranslateProps;

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
    const { groupBy, report, reportFetchStatus, t } = this.props;

    const cost = formatCurrency(
      report && report.meta && report.meta.total
        ? report.meta.total.cost.total.value
        : 0
    );

    return (
      <>
        <div style={styles.subTitle}>
          <Title headingLevel="h2" size="lg">
            {t('details.cost_value', { value: cost })}
          </Title>
        </div>
        <div style={styles.mainContent}>
          <ReportSummaryItems
            idKey={groupBy as any}
            report={report}
            status={reportFetchStatus}
          >
            {({ items }) =>
              items.map(_item => (
                <ReportSummaryItem
                  key={_item.id}
                  formatOptions={{}}
                  formatValue={formatValue}
                  label={_item.label ? _item.label.toString() : ''}
                  totalValue={report.meta.total.cost.total.value}
                  units={report.meta.total.cost.total.units}
                  value={_item.cost}
                />
              ))
            }
          </ReportSummaryItems>
        </div>
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  SummaryModalViewOwnProps,
  SummaryModalViewStateProps
>((state, { filterBy, groupBy, parentGroupBy, reportPathsType }) => {
  const query: Query = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'monthly',
      [parentGroupBy]: filterBy,
    },
    group_by: { [groupBy]: '*' },
  };
  const queryString = getQuery(query);
  const report = reportSelectors.selectReport(
    state,
    reportPathsType,
    reportType,
    queryString
  );
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    reportType,
    queryString
  );
  return {
    queryString,
    report,
    reportFetchStatus,
  };
});

const mapDispatchToProps: SummaryModalViewDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const SummaryModalView = translate()(
  connect(mapStateToProps, mapDispatchToProps)(SummaryModalViewBase)
);

export { SummaryModalView, SummaryModalViewProps };

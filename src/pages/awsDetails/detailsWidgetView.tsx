import { Title } from '@patternfly/react-core';
import { AwsQuery, getQuery } from 'api/awsQuery';
import { AwsReport, AwsReportType } from 'api/awsReports';
import {
  AwsReportSummaryItem,
  AwsReportSummaryItems,
} from 'components/reports/awsReportSummary';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { awsReportsActions, awsReportsSelectors } from 'store/awsReports';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { formatValue } from 'utils/formatValue';
import { formatCurrency } from 'utils/formatValue';
import { styles } from './detailsWidgetModal.styles';

interface DetailsWidgetViewOwnProps {
  groupBy: string;
}

interface DetailsWidgetViewStateProps {
  queryString?: string;
  report?: AwsReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsWidgetViewDispatchProps {
  fetchReport?: typeof awsReportsActions.fetchReport;
}

type DetailsWidgetViewProps = DetailsWidgetViewOwnProps &
  DetailsWidgetViewStateProps &
  DetailsWidgetViewDispatchProps &
  InjectedTranslateProps;

const reportType = AwsReportType.cost;

class DetailsWidgetViewBase extends React.Component<DetailsWidgetViewProps> {
  constructor(props: DetailsWidgetViewProps) {
    super(props);
  }

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsWidgetViewProps) {
    const { fetchReport, queryString } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportType, queryString);
    }
  }

  public render() {
    const { groupBy, report, t } = this.props;

    const cost = formatCurrency(
      report && report.meta && report.meta.total
        ? report.meta.total.cost.value
        : 0
    );

    return (
      <>
        <div className={styles.subTitle}>
          <Title size="lg">
            {t('aws_details.cost_value', { value: cost })}
          </Title>
        </div>
        <div className={styles.mainContent}>
          <AwsReportSummaryItems idKey={groupBy as any} report={report}>
            {({ items }) =>
              items.map(_item => (
                <AwsReportSummaryItem
                  key={_item.id}
                  formatOptions={{}}
                  formatValue={formatValue}
                  label={_item.label ? _item.label.toString() : ''}
                  totalValue={report.meta.total.cost.value}
                  units={_item.units}
                  value={_item.cost}
                />
              ))
            }
          </AwsReportSummaryItems>
        </div>
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsWidgetViewOwnProps,
  DetailsWidgetViewStateProps
>((state, { groupBy }) => {
  const query: AwsQuery = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'monthly',
    },
    group_by: { [groupBy]: '*' },
  };
  const queryString = getQuery(query);
  const report = awsReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    reportType,
    queryString
  );
  return {
    queryString,
    report,
    reportFetchStatus,
  };
});

const mapDispatchToProps: DetailsWidgetViewDispatchProps = {
  fetchReport: awsReportsActions.fetchReport,
};

const DetailsWidgetView = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsWidgetViewBase)
);

export { DetailsWidgetView, DetailsWidgetViewProps };

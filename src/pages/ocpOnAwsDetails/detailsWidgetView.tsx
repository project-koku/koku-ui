import { Title } from '@patternfly/react-core';
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
import { formatCurrency } from 'utils/formatValue';
import { styles } from './detailsWidgetModal.styles';

interface DetailsWidgetViewOwnProps {
  groupBy: string;
}

interface DetailsWidgetViewStateProps {
  queryString?: string;
  report?: OcpOnAwsReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsWidgetViewDispatchProps {
  fetchReport?: typeof ocpOnAwsReportsActions.fetchReport;
}

type DetailsWidgetViewProps = DetailsWidgetViewOwnProps &
  DetailsWidgetViewStateProps &
  DetailsWidgetViewDispatchProps &
  InjectedTranslateProps;

const reportType = OcpOnAwsReportType.cost;

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
      report &&
        report.meta &&
        report.meta.total &&
        report.meta.total.infrastructure_cost
        ? report.meta.total.infrastructure_cost.value
        : 0
    );

    return (
      <>
        <div className={styles.subTitle}>
          <Title size="lg">
            {t('ocp_on_aws_details.cost_value', { value: cost })}
          </Title>
        </div>
        <div className={styles.mainContent}>
          <OcpOnAwsReportSummaryItems idKey={groupBy as any} report={report}>
            {({ items }) =>
              items.map(_item => (
                <OcpOnAwsReportSummaryItem
                  key={_item.id}
                  formatOptions={{}}
                  formatValue={formatValue}
                  label={_item.label ? _item.label.toString() : ''}
                  totalValue={report.meta.total.infrastructure_cost.value}
                  units={_item.units}
                  value={_item.infrastructureCost}
                />
              ))
            }
          </OcpOnAwsReportSummaryItems>
        </div>
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsWidgetViewOwnProps,
  DetailsWidgetViewStateProps
>((state, { groupBy }) => {
  const query: OcpOnAwsQuery = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'monthly',
    },
    group_by: { [groupBy]: '*' },
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
    queryString,
    report,
    reportFetchStatus,
  };
});

const mapDispatchToProps: DetailsWidgetViewDispatchProps = {
  fetchReport: ocpOnAwsReportsActions.fetchReport,
};

const DetailsWidgetView = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsWidgetViewBase)
);

export { DetailsWidgetView, DetailsWidgetViewProps };

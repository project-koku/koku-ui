import { Title } from '@patternfly/react-core';
import { getQuery, OcpQuery } from 'api/queries/ocpQuery';
import { OcpReport } from 'api/reports/ocpReports';
import { ReportType } from 'api/reports/report';
import {
  ReportSummaryItem,
  ReportSummaryItems,
} from 'components/reports/reportSummary';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  ocpReportsActions,
  ocpReportsSelectors,
} from 'store/reports/ocpReports';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { formatValue } from 'utils/formatValue';
import { formatCurrency } from 'utils/formatValue';
import { styles } from './detailsWidgetModal.styles';

interface DetailsWidgetViewOwnProps {
  groupBy: string;
  item: ComputedReportItem;
}

interface DetailsWidgetViewStateProps {
  queryString?: string;
  report?: OcpReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsWidgetViewDispatchProps {
  fetchReport?: typeof ocpReportsActions.fetchReport;
}

type DetailsWidgetViewProps = DetailsWidgetViewOwnProps &
  DetailsWidgetViewStateProps &
  DetailsWidgetViewDispatchProps &
  InjectedTranslateProps;

const reportType = ReportType.cost;

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
    const { report, reportFetchStatus, t } = this.props;

    const cost = formatCurrency(
      report && report.meta && report.meta.total
        ? report.meta.total.cost.total.value
        : 0
    );

    return (
      <>
        <div style={styles.subTitle}>
          <Title size="lg">
            {t('ocp_details.cost_value', { value: cost })}
          </Title>
        </div>
        <div style={styles.mainContent}>
          <ReportSummaryItems
            idKey={'project' as any}
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
                  units={_item.units}
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
  DetailsWidgetViewOwnProps,
  DetailsWidgetViewStateProps
>((state, { groupBy, item }) => {
  const query: OcpQuery = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'monthly',
    },
    group_by: {
      project: '*',
      [groupBy]: item.label || item.id,
    },
  };
  const queryString = getQuery(query);
  const report = ocpReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
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
  fetchReport: ocpReportsActions.fetchReport,
};

const DetailsWidgetView = translate()(
  connect(mapStateToProps, mapDispatchToProps)(DetailsWidgetViewBase)
);

export { DetailsWidgetView, DetailsWidgetViewProps };

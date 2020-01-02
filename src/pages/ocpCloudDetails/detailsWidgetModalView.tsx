import { Title } from '@patternfly/react-core';
import { getQuery, OcpCloudQuery } from 'api/ocpCloudQuery';
import { OcpCloudReport, OcpCloudReportType } from 'api/ocpCloudReports';
import {
  OcpCloudReportSummaryItem,
  OcpCloudReportSummaryItems,
} from 'components/reports/ocpCloudReportSummary';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  ocpCloudReportsActions,
  ocpCloudReportsSelectors,
} from 'store/ocpCloudReports';
import { formatValue } from 'utils/formatValue';
import { formatCurrency } from 'utils/formatValue';
import { ComputedOcpCloudReportItem } from 'utils/getComputedOcpCloudReportItems';
import { styles } from './detailsWidgetModal.styles';

interface DetailsWidgetModalViewOwnProps {
  groupBy: string;
  item: ComputedOcpCloudReportItem;
  parentGroupBy: string;
}

interface DetailsWidgetModalViewStateProps {
  queryString?: string;
  report?: OcpCloudReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsWidgetModalViewDispatchProps {
  fetchReport?: typeof ocpCloudReportsActions.fetchReport;
}

type DetailsWidgetModalViewProps = DetailsWidgetModalViewOwnProps &
  DetailsWidgetModalViewStateProps &
  DetailsWidgetModalViewDispatchProps &
  InjectedTranslateProps;

const reportType = OcpCloudReportType.cost;

class DetailsWidgetModalViewBase extends React.Component<
  DetailsWidgetModalViewProps
> {
  constructor(props: DetailsWidgetModalViewProps) {
    super(props);
  }

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsWidgetModalViewProps) {
    const { fetchReport, queryString } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportType, queryString);
    }
  }

  public render() {
    const { groupBy, report, reportFetchStatus, t } = this.props;

    const cost = formatCurrency(
      report && report.meta && report.meta.total && report.meta.total.cost
        ? report.meta.total.cost.value
        : 0
    );

    return (
      <>
        <div className={styles.subTitle}>
          <Title size="lg">
            {t('ocp_cloud_details.cost_value', { value: cost })}
          </Title>
        </div>
        <div className={styles.mainContent}>
          <OcpCloudReportSummaryItems
            idKey={groupBy as any}
            report={report}
            status={reportFetchStatus}
          >
            {({ items }) =>
              items.map(_item => (
                <OcpCloudReportSummaryItem
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
          </OcpCloudReportSummaryItems>
        </div>
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsWidgetModalViewOwnProps,
  DetailsWidgetModalViewStateProps
>((state, { groupBy, item, parentGroupBy }) => {
  const query: OcpCloudQuery = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'monthly',
      [parentGroupBy]: item.label || item.id,
    },
    group_by: { [groupBy]: '*' },
  };
  const queryString = getQuery(query);
  const report = ocpCloudReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = ocpCloudReportsSelectors.selectReportFetchStatus(
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

const mapDispatchToProps: DetailsWidgetModalViewDispatchProps = {
  fetchReport: ocpCloudReportsActions.fetchReport,
};

const DetailsWidgetModalView = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsWidgetModalViewBase)
);

export { DetailsWidgetModalView, DetailsWidgetModalViewProps };

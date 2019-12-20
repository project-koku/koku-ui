import { Title } from '@patternfly/react-core';
import { getQuery, OcpOnCloudQuery } from 'api/ocpOnCloudQuery';
import { OcpOnCloudReport, OcpOnCloudReportType } from 'api/ocpOnCloudReports';
import {
  OcpOnCloudReportSummaryItem,
  OcpOnCloudReportSummaryItems,
} from 'components/reports/ocpOnCloudReportSummary';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  ocpOnCloudReportsActions,
  ocpOnCloudReportsSelectors,
} from 'store/ocpOnCloudReports';
import { formatValue } from 'utils/formatValue';
import { formatCurrency } from 'utils/formatValue';
import { ComputedOcpOnCloudReportItem } from 'utils/getComputedOcpOnCloudReportItems';
import { styles } from './detailsWidgetModal.styles';

interface DetailsWidgetModalViewOwnProps {
  groupBy: string;
  item: ComputedOcpOnCloudReportItem;
  parentGroupBy: string;
}

interface DetailsWidgetModalViewStateProps {
  queryString?: string;
  report?: OcpOnCloudReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsWidgetModalViewDispatchProps {
  fetchReport?: typeof ocpOnCloudReportsActions.fetchReport;
}

type DetailsWidgetModalViewProps = DetailsWidgetModalViewOwnProps &
  DetailsWidgetModalViewStateProps &
  DetailsWidgetModalViewDispatchProps &
  InjectedTranslateProps;

const reportType = OcpOnCloudReportType.cost;

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
            {t('ocp_on_cloud_details.cost_value', { value: cost })}
          </Title>
        </div>
        <div className={styles.mainContent}>
          <OcpOnCloudReportSummaryItems
            idKey={groupBy as any}
            report={report}
            status={reportFetchStatus}
          >
            {({ items }) =>
              items.map(_item => (
                <OcpOnCloudReportSummaryItem
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
          </OcpOnCloudReportSummaryItems>
        </div>
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsWidgetModalViewOwnProps,
  DetailsWidgetModalViewStateProps
>((state, { groupBy, item, parentGroupBy }) => {
  const query: OcpOnCloudQuery = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'monthly',
      [parentGroupBy]: item.label || item.id,
    },
    group_by: { [groupBy]: '*' },
  };
  const queryString = getQuery(query);
  const report = ocpOnCloudReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = ocpOnCloudReportsSelectors.selectReportFetchStatus(
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
  fetchReport: ocpOnCloudReportsActions.fetchReport,
};

const DetailsWidgetModalView = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsWidgetModalViewBase)
);

export { DetailsWidgetModalView, DetailsWidgetModalViewProps };

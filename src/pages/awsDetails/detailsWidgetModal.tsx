import { Modal, Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
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
import { ComputedAwsReportItem } from 'utils/getComputedAwsReportItems';
import { modalOverride, styles } from './detailsWidgetModal.styles';

interface DetailsWidgetModalOwnProps {
  groupBy: string;
  isOpen: boolean;
  item: ComputedAwsReportItem;
  onClose(isOpen: boolean);
  tab: string;
}

interface DetailsWidgetModalStateProps {
  queryString?: string;
  report?: AwsReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsWidgetModalDispatchProps {
  fetchReport?: typeof awsReportsActions.fetchReport;
}

type DetailsWidgetModalProps = DetailsWidgetModalOwnProps &
  DetailsWidgetModalStateProps &
  DetailsWidgetModalDispatchProps &
  InjectedTranslateProps;

const reportType = AwsReportType.cost;

class DetailsWidgetModalBase extends React.Component<DetailsWidgetModalProps> {
  constructor(props: DetailsWidgetModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsWidgetModalProps) {
    const { fetchReport, queryString } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportType, queryString);
    }
  }

  public shouldComponentUpdate(nextProps: DetailsWidgetModalProps) {
    const { isOpen, item } = this.props;
    return nextProps.item !== item || nextProps.isOpen !== isOpen;
  }

  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const { groupBy, isOpen, item, report, t, tab } = this.props;

    const cost = formatCurrency(
      report && report.meta && report.meta.total
        ? report.meta.total.cost.value
        : 0
    );

    return (
      <Modal
        className={`${modalOverride} ${css(styles.modal)}`}
        isLarge
        isOpen={isOpen}
        onClose={this.handleClose}
        title={t('ocp_on_aws_details.widget_modal_title', {
          groupBy,
          name: item.label,
          localGroupBy: tab,
        })}
      >
        <div className={styles.subTitle}>
          <Title size="lg">
            {t('ocp_on_aws_details.cost_value', { value: cost })}
          </Title>
        </div>
        <div className={styles.mainContent}>
          <AwsReportSummaryItems idKey={tab as any} report={report}>
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
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsWidgetModalOwnProps,
  DetailsWidgetModalStateProps
>((state, { tab }) => {
  const query: AwsQuery = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'monthly',
    },
    group_by: { [tab]: '*' },
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

const mapDispatchToProps: DetailsWidgetModalDispatchProps = {
  fetchReport: awsReportsActions.fetchReport,
};

const DetailsWidgetModal = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsWidgetModalBase)
);

export { DetailsWidgetModal, DetailsWidgetModalProps };

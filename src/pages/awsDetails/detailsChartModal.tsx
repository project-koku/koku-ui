import { Modal, Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { AwsQuery, getQuery } from 'api/awsQuery';
import { AwsReport, AwsReportType } from 'api/awsReports';
import {
  AwsReportSummaryItem,
  AwsReportSummaryItems,
} from 'components/awsReportSummary';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { awsReportsActions, awsReportsSelectors } from 'store/awsReports';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { formatValue } from 'utils/formatValue';
import { formatCurrency } from 'utils/formatValue';
import { ComputedAwsReportItem } from 'utils/getComputedAwsReportItems';
import { modalOverride, styles } from './detailsChartModal.styles';

interface DetailsChartModalOwnProps {
  groupBy: string;
  item: ComputedAwsReportItem;
  isOpen: boolean;
  localGroupBy: string;
  onClose(isOpen: boolean);
}

interface DetailsChartModalStateProps {
  queryString?: string;
  report?: AwsReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsChartModalDispatchProps {
  fetchReport?: typeof awsReportsActions.fetchReport;
}

type DetailsChartModalProps = DetailsChartModalOwnProps &
  DetailsChartModalStateProps &
  DetailsChartModalDispatchProps &
  InjectedTranslateProps;

class DetailsChartModalBase extends React.Component<DetailsChartModalProps> {
  constructor(props: DetailsChartModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public componentDidMount() {
    const { report, queryString } = this.props;
    if (!report) {
      this.props.fetchReport(AwsReportType.cost, queryString);
    }
  }

  public componentDidUpdate(prevProps: DetailsChartModalProps) {
    if (prevProps.queryString !== this.props.queryString) {
      this.props.fetchReport(AwsReportType.cost, this.props.queryString);
    }
  }

  public shouldComponentUpdate(nextProps: DetailsChartModalProps) {
    const { isOpen, item } = this.props;
    return nextProps.item !== item || nextProps.isOpen !== isOpen;
  }

  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const { groupBy, isOpen, item, localGroupBy, report, t } = this.props;

    const cost = formatCurrency(
      report && report.total ? report.total.value : 0
    );

    return (
      <Modal
        className={`${modalOverride} ${css(styles.modal)}`}
        isLarge
        isOpen={isOpen}
        onClose={this.handleClose}
        title={t('aws_details.chart_modal_title', {
          groupBy,
          name: item.label,
          localGroupBy,
        })}
      >
        <div className={styles.subTitle}>
          <Title size="lg">
            {t('aws_details.cost_value', { value: cost })}
          </Title>
        </div>
        <div className={styles.mainContent}>
          <AwsReportSummaryItems idKey={localGroupBy as any} report={report}>
            {({ items }) =>
              items.map(_item => (
                <AwsReportSummaryItem
                  key={_item.id}
                  formatOptions={{}}
                  formatValue={formatValue}
                  label={_item.label ? _item.label.toString() : ''}
                  totalValue={report.total.value}
                  units={_item.units}
                  value={_item.total}
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
  DetailsChartModalOwnProps,
  DetailsChartModalStateProps
>((state, { groupBy, item, localGroupBy }) => {
  const query: AwsQuery = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'monthly',
    },
    group_by: { [groupBy]: item.label, [localGroupBy]: '*' },
  };
  const queryString = getQuery(query);
  const report = awsReportsSelectors.selectReport(
    state,
    AwsReportType.cost,
    queryString
  );
  const reportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    AwsReportType.cost,
    queryString
  );
  return {
    queryString,
    report,
    reportFetchStatus,
  };
});

const mapDispatchToProps: DetailsChartModalDispatchProps = {
  fetchReport: awsReportsActions.fetchReport,
};

const DetailsChartModal = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsChartModalBase)
);

export { DetailsChartModal, DetailsChartModalBase, DetailsChartModalProps };

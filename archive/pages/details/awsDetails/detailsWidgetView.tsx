import { Button, ButtonType, ButtonVariant } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { AwsQuery, getQuery } from 'api/queries/awsQuery';
import { AwsReport } from 'api/reports/awsReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ReportSummaryItem,
  ReportSummaryItems,
} from 'components/reports/reportSummary';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { getTestProps, testIds } from 'testIds';
import {
  ComputedReportItem,
  getComputedReportItems,
} from 'utils/computedReport/getComputedReportItems';
import { formatValue } from 'utils/formatValue';
import { AwsDetailsTab } from './detailsWidget';
import { styles } from './detailsWidget.styles';
import { DetailsWidgetModal } from './detailsWidgetModal';
import { DetailsWidgetModalViewProps } from './detailsWidgetModalView';

interface DetailsWidgetViewOwnProps {
  groupBy: string;
  item: ComputedReportItem;
  parentGroupBy: string;
}

interface DetailsWidgetViewStateProps {
  availableTabs?: AwsDetailsTab[];
  queryString: string;
  report: AwsReport;
  reportFetchStatus: FetchStatus;
}

interface DetailsWidgetViewState {
  isWidgetModalOpen: boolean;
}

interface DetailsWidgetViewDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type DetailsWidgetViewProps = DetailsWidgetViewOwnProps &
  DetailsWidgetViewStateProps &
  DetailsWidgetViewDispatchProps &
  InjectedTranslateProps;

const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.aws;

class DetailsWidgetViewBase extends React.Component<DetailsWidgetViewProps> {
  public state: DetailsWidgetViewState = {
    isWidgetModalOpen: false,
  };

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportPathsType, reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsWidgetModalViewProps) {
    const { fetchReport, queryString } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportPathsType, reportType, queryString);
    }
  }

  private getItems = () => {
    const { groupBy, report } = this.props;

    const computedItems = getComputedReportItems({
      report,
      idKey: groupBy as any,
    });
    return computedItems;
  };

  private getTabItem = reportItem => {
    const { report } = this.props;

    return (
      <ReportSummaryItem
        key={`${reportItem.id}-item`}
        formatOptions={{}}
        formatValue={formatValue}
        label={reportItem.label ? reportItem.label.toString() : ''}
        totalValue={
          reportType === ReportType.cost
            ? report.meta.total.cost.total.value
            : report.meta.total.usage.value
        }
        units={reportItem.units}
        value={
          reportType === ReportType.cost ? reportItem.cost : reportItem.usage
        }
      />
    );
  };

  private getViewAll = () => {
    const { groupBy, item, parentGroupBy, t } = this.props;
    const { isWidgetModalOpen } = this.state;
    const computedItems = this.getItems();

    const otherIndex = computedItems.findIndex(i => {
      const id = i.id;
      if (id && id !== null) {
        return id.toString().includes('Other');
      }
    });

    if (otherIndex !== -1) {
      return (
        <div style={styles.viewAllContainer}>
          <Button
            {...getTestProps(testIds.details.view_all_btn)}
            onClick={this.handleWidgetModalOpen}
            type={ButtonType.button}
            variant={ButtonVariant.link}
          >
            {t('aws_details.view_all', { value: groupBy })}
          </Button>
          <DetailsWidgetModal
            groupBy={groupBy}
            isOpen={isWidgetModalOpen}
            item={item}
            onClose={this.handleWidgetModalClose}
            parentGroupBy={parentGroupBy}
          />
        </div>
      );
    } else {
      return null;
    }
  };

  private handleWidgetModalClose = (isOpen: boolean) => {
    this.setState({ isWidgetModalOpen: isOpen });
  };

  private handleWidgetModalOpen = event => {
    this.setState({ isWidgetModalOpen: true });
    event.preventDefault();
  };

  public render() {
    const { groupBy, report, reportFetchStatus } = this.props;

    return (
      <>
        {Boolean(reportFetchStatus === FetchStatus.inProgress) ? (
          <>
            <Skeleton size={SkeletonSize.md} />
            <Skeleton size={SkeletonSize.md} style={styles.skeleton} />
            <Skeleton size={SkeletonSize.md} style={styles.skeleton} />
            <Skeleton size={SkeletonSize.md} style={styles.skeleton} />
          </>
        ) : (
          <>
            <div style={styles.tabs}>
              <ReportSummaryItems
                idKey={groupBy as any}
                key={`${groupBy}-items`}
                report={report}
                status={reportFetchStatus}
              >
                {({ items }) =>
                  items.map(reportItem => this.getTabItem(reportItem))
                }
              </ReportSummaryItems>
            </div>
            {this.getViewAll()}
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsWidgetViewOwnProps,
  DetailsWidgetViewStateProps
>((state, { groupBy, item, parentGroupBy }) => {
  const query: AwsQuery = {
    filter: {
      limit: 3,
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'monthly',
      [parentGroupBy]: item.label || item.id,
    },
    group_by: { [groupBy]: '*' },
  };
  const queryString = getQuery(query);
  const report = reportSelectors.selectReport(state, reportType, queryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(
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
  fetchReport: reportActions.fetchReport,
};

const DetailsWidgetView = translate()(
  connect(mapStateToProps, mapDispatchToProps)(DetailsWidgetViewBase)
);

export { DetailsWidgetView, DetailsWidgetViewProps };

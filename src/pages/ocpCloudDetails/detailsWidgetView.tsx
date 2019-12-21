import { Button, ButtonType, ButtonVariant } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
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
import { getTestProps, testIds } from 'testIds';
import { formatValue } from 'utils/formatValue';
import { ComputedOcpCloudReportItem } from 'utils/getComputedOcpCloudReportItems';
import { getComputedOcpCloudReportItems } from 'utils/getComputedOcpCloudReportItems';
import { OcpCloudDetailsTab } from './detailsWidget';
import { styles } from './detailsWidget.styles';
import { DetailsWidgetModal } from './detailsWidgetModal';
import { DetailsWidgetModalViewProps } from './detailsWidgetModalView';

interface DetailsWidgetViewOwnProps {
  groupBy: string;
  item: ComputedOcpCloudReportItem;
  parentGroupBy: string;
}

interface DetailsWidgetViewStateProps {
  availableTabs?: OcpCloudDetailsTab[];
  queryString: string;
  report: OcpCloudReport;
  reportFetchStatus: FetchStatus;
}

interface DetailsWidgetViewState {
  isWidgetModalOpen: boolean;
}

interface DetailsWidgetViewDispatchProps {
  fetchReport?: typeof ocpCloudReportsActions.fetchReport;
}

type DetailsWidgetViewProps = DetailsWidgetViewOwnProps &
  DetailsWidgetViewStateProps &
  DetailsWidgetViewDispatchProps &
  InjectedTranslateProps;

const reportType = OcpCloudReportType.cost;

class DetailsWidgetViewBase extends React.Component<DetailsWidgetViewProps> {
  public state: DetailsWidgetViewState = {
    isWidgetModalOpen: false,
  };

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

  private getItems = () => {
    const { groupBy, report } = this.props;

    const computedItems = getComputedOcpCloudReportItems({
      report,
      idKey: groupBy as any,
    });
    return computedItems;
  };

  private getTabItem = reportItem => {
    const { report } = this.props;

    return (
      <OcpCloudReportSummaryItem
        key={reportItem.id}
        formatOptions={{}}
        formatValue={formatValue}
        label={reportItem.label ? reportItem.label.toString() : ''}
        totalValue={report.meta.total.infrastructure_cost.value}
        units={reportItem.units}
        value={reportItem.infrastructureCost}
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
        <div className={css(styles.viewAllContainer)}>
          <Button
            {...getTestProps(testIds.details.view_all_btn)}
            onClick={this.handleWidgetModalOpen}
            type={ButtonType.button}
            variant={ButtonVariant.link}
          >
            {t('ocp_on_cloud_details.view_all', { value: groupBy })}
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
            <Skeleton size={SkeletonSize.md} className={css(styles.skeleton)} />
            <Skeleton size={SkeletonSize.md} className={css(styles.skeleton)} />
            <Skeleton size={SkeletonSize.md} className={css(styles.skeleton)} />
          </>
        ) : (
          <>
            <div className={css(styles.tabs)}>
              <OcpCloudReportSummaryItems
                idKey={groupBy as any}
                key={`${groupBy}-items`}
                report={report}
                status={reportFetchStatus}
              >
                {({ items }) =>
                  items.map(reportItem => this.getTabItem(reportItem))
                }
              </OcpCloudReportSummaryItems>
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
  const query: OcpCloudQuery = {
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

const mapDispatchToProps: DetailsWidgetViewDispatchProps = {
  fetchReport: ocpCloudReportsActions.fetchReport,
};

const DetailsWidgetView = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsWidgetViewBase)
);

export { DetailsWidgetView, DetailsWidgetViewProps };

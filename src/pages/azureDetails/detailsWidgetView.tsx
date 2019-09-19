import { Button, ButtonType, ButtonVariant } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import {
  Skeleton,
  SkeletonSize,
} from '@red-hat-insights/insights-frontend-components/components/Skeleton';
import { AzureQuery, getQuery } from 'api/azureQuery';
import { AzureReport, AzureReportType } from 'api/azureReports';
import {
  AzureReportSummaryItem,
  AzureReportSummaryItems,
} from 'components/reports/azureReportSummary';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { azureReportsActions, azureReportsSelectors } from 'store/azureReports';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { getTestProps, testIds } from 'testIds';
import { formatValue } from 'utils/formatValue';
import { ComputedAzureReportItem } from 'utils/getComputedAzureReportItems';
import { getComputedAzureReportItems } from 'utils/getComputedAzureReportItems';
import { AzureDetailsTab } from './detailsWidget';
import { styles } from './detailsWidget.styles';
import { DetailsWidgetModal } from './detailsWidgetModal';
import { DetailsWidgetModalViewProps } from './detailsWidgetModalView';

interface DetailsWidgetViewOwnProps {
  groupBy: string;
  item: ComputedAzureReportItem;
  parentGroupBy: string;
}

interface DetailsWidgetViewStateProps {
  availableTabs?: AzureDetailsTab[];
  queryString: string;
  report: AzureReport;
  reportFetchStatus: FetchStatus;
}

interface DetailsWidgetViewState {
  isWidgetModalOpen: boolean;
}

interface DetailsWidgetViewDispatchProps {
  fetchReport?: typeof azureReportsActions.fetchReport;
}

type DetailsWidgetViewProps = DetailsWidgetViewOwnProps &
  DetailsWidgetViewStateProps &
  DetailsWidgetViewDispatchProps &
  InjectedTranslateProps;

const reportType = AzureReportType.cost;

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

    const computedItems = getComputedAzureReportItems({
      report,
      idKey: groupBy as any,
    });
    return computedItems;
  };

  private getTabItem = reportItem => {
    const { report } = this.props;

    return (
      <AzureReportSummaryItem
        key={`${reportItem.id}-item`}
        formatOptions={{}}
        formatValue={formatValue}
        label={reportItem.label ? reportItem.label.toString() : ''}
        totalValue={
          reportType === AzureReportType.cost
            ? report.meta.total.cost.value
            : report.meta.total.usage.value
        }
        units={reportItem.units}
        value={
          reportType === AzureReportType.cost
            ? reportItem.cost
            : reportItem.usage
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
        <div className={css(styles.viewAllContainer)}>
          <Button
            {...getTestProps(testIds.details.view_all_btn)}
            onClick={this.handleWidgetModalOpen}
            type={ButtonType.button}
            variant={ButtonVariant.link}
          >
            {t('azure_details.view_all', {
              value: t(`group_by.top_values.${groupBy}`),
            })}
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
              <AzureReportSummaryItems
                idKey={groupBy as any}
                key={`${groupBy}-items`}
                report={report}
                status={reportFetchStatus}
              >
                {({ items }) =>
                  items.map(reportItem => this.getTabItem(reportItem))
                }
              </AzureReportSummaryItems>
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
  const query: AzureQuery = {
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
  const report = azureReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = azureReportsSelectors.selectReportFetchStatus(
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
  fetchReport: azureReportsActions.fetchReport,
};

const DetailsWidgetView = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsWidgetViewBase)
);

export { DetailsWidgetView, DetailsWidgetViewProps };

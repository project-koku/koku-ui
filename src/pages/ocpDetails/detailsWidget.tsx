import { Button, ButtonType, ButtonVariant } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { getQuery, OcpQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import {
  OcpReportSummaryItem,
  OcpReportSummaryItems,
} from 'components/reports/ocpReportSummary';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpReportsActions, ocpReportsSelectors } from 'store/ocpReports';
import { getTestProps, testIds } from 'testIds';
import { ComputedOcpReportItem } from 'utils/computedReport/getComputedOcpReportItems';
import { getComputedOcpReportItems } from 'utils/computedReport/getComputedOcpReportItems';
import { formatValue } from 'utils/formatValue';
import { styles } from './detailsWidget.styles';
import { DetailsWidgetModal } from './detailsWidgetModal';

interface DetailsWidgetOwnProps {
  groupBy: string;
  item: ComputedOcpReportItem;
}

interface DetailsWidgetStateProps {
  queryString?: string;
  report?: OcpReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsWidgetState {
  isDetailsChartModalOpen: boolean;
}

interface DetailsWidgetDispatchProps {
  fetchReport?: typeof ocpReportsActions.fetchReport;
}

type DetailsWidgetProps = DetailsWidgetOwnProps &
  DetailsWidgetStateProps &
  DetailsWidgetDispatchProps &
  InjectedTranslateProps;

const reportType = OcpReportType.cost;

class DetailsWidgetBase extends React.Component<DetailsWidgetProps> {
  public state: DetailsWidgetState = {
    isDetailsChartModalOpen: false,
  };

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsWidgetProps) {
    const { fetchReport, queryString } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportType, queryString);
    }
  }

  private getItems = (currentTab: string) => {
    const { report } = this.props;

    const computedItems = getComputedOcpReportItems({
      report,
      idKey: currentTab as any,
    });
    return computedItems;
  };

  private getSummary = () => {
    const { report, reportFetchStatus, t } = this.props;
    return (
      <>
        {t('group_by.details', { groupBy: 'project' })}
        <div className={css(styles.summary)}>
          <OcpReportSummaryItems
            idKey="project"
            report={report}
            status={reportFetchStatus}
          >
            {({ items }) =>
              items.map(reportItem => (
                <OcpReportSummaryItem
                  key={reportItem.id}
                  formatOptions={{}}
                  formatValue={formatValue}
                  label={reportItem.label.toString()}
                  totalValue={report.meta.total.cost.value}
                  units={reportItem.units}
                  value={reportItem.cost}
                />
              ))
            }
          </OcpReportSummaryItems>
          {this.getViewAll()}
        </div>
      </>
    );
  };

  private getViewAll = () => {
    const { groupBy, item, t } = this.props;
    const { isDetailsChartModalOpen } = this.state;

    const currentTab = 'project';
    const computedItems = this.getItems(currentTab);
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
            onClick={this.handleDetailsChartModalOpen}
            type={ButtonType.button}
            variant={ButtonVariant.link}
          >
            {t('ocp_details.view_all', { value: currentTab })}
          </Button>
          <DetailsWidgetModal
            groupBy={currentTab}
            isOpen={isDetailsChartModalOpen}
            item={item}
            onClose={this.handleDetailsChartModalClose}
            parentGroupBy={groupBy}
          />
        </div>
      );
    } else {
      return null;
    }
  };

  private handleDetailsChartModalClose = (isOpen: boolean) => {
    this.setState({ isDetailsChartModalOpen: isOpen });
  };

  private handleDetailsChartModalOpen = event => {
    this.setState({ isDetailsChartModalOpen: true });
    event.preventDefault();
  };

  public render() {
    const { reportFetchStatus } = this.props;

    return (
      <div>
        {Boolean(reportFetchStatus === FetchStatus.inProgress) ? (
          <>
            <Skeleton size={SkeletonSize.md} />
            <Skeleton size={SkeletonSize.md} className={css(styles.skeleton)} />
            <Skeleton size={SkeletonSize.md} className={css(styles.skeleton)} />
            <Skeleton size={SkeletonSize.md} className={css(styles.skeleton)} />
          </>
        ) : (
          this.getSummary()
        )}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsWidgetOwnProps,
  DetailsWidgetStateProps
>((state, { groupBy, item }) => {
  const query: OcpQuery = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'monthly',
      limit: 3,
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
    report,
    reportFetchStatus,
    queryString,
  };
});

const mapDispatchToProps: DetailsWidgetDispatchProps = {
  fetchReport: ocpReportsActions.fetchReport,
};

const DetailsWidget = translate()(
  connect(mapStateToProps, mapDispatchToProps)(DetailsWidgetBase)
);

export { DetailsWidget, DetailsWidgetProps };

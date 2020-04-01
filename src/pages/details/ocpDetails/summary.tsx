import { Button, ButtonType, ButtonVariant } from '@patternfly/react-core';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { getQuery, OcpQuery } from 'api/queries/ocpQuery';
import { OcpReport } from 'api/reports/ocpReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ReportSummaryItem,
  ReportSummaryItems,
} from 'components/reports/reportSummary';
import { styles } from 'pages/details/components/summary/summary.styles';
import { SummaryModal } from 'pages/details/components/summary/summaryModal';
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

interface SummaryOwnProps {
  groupBy: string;
  item: ComputedReportItem;
}

interface SummaryStateProps {
  queryString?: string;
  report?: OcpReport;
  reportFetchStatus?: FetchStatus;
}

interface SummaryState {
  isBulletChartModalOpen: boolean;
}

interface SummaryDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type SummaryProps = SummaryOwnProps &
  SummaryStateProps &
  SummaryDispatchProps &
  InjectedTranslateProps;

const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.ocp;

class SummaryBase extends React.Component<SummaryProps> {
  public state: SummaryState = {
    isBulletChartModalOpen: false,
  };

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportPathsType, reportType, queryString);
  }

  public componentDidUpdate(prevProps: SummaryProps) {
    const { fetchReport, queryString } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportPathsType, reportType, queryString);
    }
  }

  private getItems = (currentTab: string) => {
    const { report } = this.props;

    const computedItems = getComputedReportItems({
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
        <div style={styles.summary}>
          <ReportSummaryItems
            idKey={'project' as any}
            report={report}
            status={reportFetchStatus}
          >
            {({ items }) =>
              items.map(reportItem => (
                <ReportSummaryItem
                  key={reportItem.id}
                  formatOptions={{}}
                  formatValue={formatValue}
                  label={reportItem.label.toString()}
                  totalValue={report.meta.total.cost.total.value}
                  units={report.meta.total.cost.total.units}
                  value={reportItem.cost}
                />
              ))
            }
          </ReportSummaryItems>
          {this.getViewAll()}
        </div>
      </>
    );
  };

  private getViewAll = () => {
    const { groupBy, item, t } = this.props;
    const { isBulletChartModalOpen } = this.state;

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
        <div style={styles.viewAllContainer}>
          <Button
            {...getTestProps(testIds.details.view_all_btn)}
            onClick={this.handleBulletChartModalOpen}
            type={ButtonType.button}
            variant={ButtonVariant.link}
          >
            {t('details.view_all', { groupBy: currentTab })}
          </Button>
          <SummaryModal
            groupBy={currentTab}
            isOpen={isBulletChartModalOpen}
            item={item}
            onClose={this.handleBulletChartModalClose}
            parentGroupBy={groupBy}
            reportPathsType={reportPathsType}
          />
        </div>
      );
    } else {
      return null;
    }
  };

  private handleBulletChartModalClose = (isOpen: boolean) => {
    this.setState({ isBulletChartModalOpen: isOpen });
  };

  private handleBulletChartModalOpen = event => {
    this.setState({ isBulletChartModalOpen: true });
    event.preventDefault();
  };

  public render() {
    const { reportFetchStatus } = this.props;

    return (
      <div>
        {Boolean(reportFetchStatus === FetchStatus.inProgress) ? (
          <>
            <Skeleton size={SkeletonSize.md} />
            <Skeleton size={SkeletonSize.md} style={styles.skeleton} />
            <Skeleton size={SkeletonSize.md} style={styles.skeleton} />
            <Skeleton size={SkeletonSize.md} style={styles.skeleton} />
          </>
        ) : (
          this.getSummary()
        )}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  SummaryOwnProps,
  SummaryStateProps
>((state, { groupBy, item }) => {
  const query: OcpQuery = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'monthly',
      limit: 3,
      [groupBy]: item.label || item.id,
    },
    group_by: { project: '*' },
  };
  const queryString = getQuery(query);
  const report = reportSelectors.selectReport(state, reportType, queryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(
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

const mapDispatchToProps: SummaryDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const Summary = translate()(
  connect(mapStateToProps, mapDispatchToProps)(SummaryBase)
);

export { Summary, SummaryProps };

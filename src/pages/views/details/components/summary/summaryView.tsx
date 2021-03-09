import { Button, ButtonType, ButtonVariant } from '@patternfly/react-core';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';
import { getQuery, Query } from 'api/queries/query';
import { Report } from 'api/reports/report';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { ReportSummaryItem, ReportSummaryItems } from 'components/reports/reportSummary';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { getTestProps, testIds } from 'testIds';
import { getComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { formatValue } from 'utils/formatValue';

import { styles } from './summary.styles';
import { SummaryModal } from './summaryModal';
import { SummaryModalViewProps } from './summaryModalView';

interface SummaryViewOwnProps {
  groupBy: string;
  groupByValue: string | number;
  query?: Query;
  reportGroupBy: string;
  reportPathsType: ReportPathsType;
}

interface SummaryViewStateProps {
  availableTabs?: string[];
  queryString: string;
  report: Report;
  reportFetchStatus: FetchStatus;
}

interface SummaryViewState {
  isSummaryModalOpen: boolean;
}

interface SummaryViewDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type SummaryViewProps = SummaryViewOwnProps & SummaryViewStateProps & SummaryViewDispatchProps & WithTranslation;

const reportType = ReportType.cost;

class SummaryViewBase extends React.Component<SummaryViewProps> {
  public state: SummaryViewState = {
    isSummaryModalOpen: false,
  };

  public componentDidMount() {
    const { fetchReport, queryString, reportPathsType } = this.props;
    fetchReport(reportPathsType, reportType, queryString);
  }

  public componentDidUpdate(prevProps: SummaryModalViewProps) {
    const { fetchReport, queryString, reportPathsType } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportPathsType, reportType, queryString);
    }
  }

  private getItems = () => {
    const { report, reportGroupBy } = this.props;

    const computedItems = getComputedReportItems({
      report,
      idKey: reportGroupBy as any,
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
        totalValue={reportType === ReportType.cost ? report.meta.total.cost.total.value : report.meta.total.usage.value}
        units={reportType === ReportType.cost ? report.meta.total.cost.total.units : report.meta.total.usage.units}
        value={reportType === ReportType.cost ? reportItem.cost : reportItem.usage}
      />
    );
  };

  private getViewAll = () => {
    const { groupBy, groupByValue, reportGroupBy, reportPathsType, t } = this.props;
    const { isSummaryModalOpen } = this.state;
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
            onClick={this.handleSummaryModalOpen}
            type={ButtonType.button}
            variant={ButtonVariant.link}
          >
            {t('details.view_all', { groupBy: reportGroupBy })}
          </Button>
          <SummaryModal
            groupBy={groupBy}
            groupByValue={groupByValue}
            isOpen={isSummaryModalOpen}
            onClose={this.handleSummaryModalClose}
            reportGroupBy={reportGroupBy}
            reportPathsType={reportPathsType}
          />
        </div>
      );
    } else {
      return null;
    }
  };

  private handleSummaryModalClose = (isOpen: boolean) => {
    this.setState({ isSummaryModalOpen: isOpen });
  };

  private handleSummaryModalOpen = event => {
    this.setState({ isSummaryModalOpen: true });
    event.preventDefault();
  };

  public render() {
    const { report, reportGroupBy, reportFetchStatus } = this.props;

    return (
      <>
        {reportFetchStatus === FetchStatus.inProgress ? (
          <>
            <Skeleton size="md" />
            <Skeleton size="md" style={styles.skeleton} />
            <Skeleton size="md" style={styles.skeleton} />
            <Skeleton size="md" style={styles.skeleton} />
          </>
        ) : (
          <>
            <div style={styles.tabs}>
              <ReportSummaryItems
                idKey={reportGroupBy as any}
                key={`${reportGroupBy}-items`}
                report={report}
                status={reportFetchStatus}
              >
                {({ items }) => items.map(reportItem => this.getTabItem(reportItem))}
              </ReportSummaryItems>
            </div>
            {this.getViewAll()}
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<SummaryViewOwnProps, SummaryViewStateProps>(
  (state, { groupBy, groupByValue, query, reportGroupBy, reportPathsType }) => {
    const newQuery: Query = {
      filter: {
        limit: 3,
        time_scope_units: 'month',
        time_scope_value: -1,
        resolution: 'monthly',
        ...(query && query.filter && query.filter.account && { account: query.filter.account }),
        ...(groupBy && { [groupBy]: groupByValue }), // details page "group_by" must be applied here
      },
      ...(query && query.filter_by && { filter_by: query.filter_by }),
      group_by: { [reportGroupBy]: '*' }, // Group by specific account, project, etc.
    };
    const queryString = getQuery(newQuery);
    const report = reportSelectors.selectReport(state, reportPathsType, reportType, queryString);
    const reportFetchStatus = reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, queryString);
    return {
      queryString,
      report,
      reportFetchStatus,
    };
  }
);

const mapDispatchToProps: SummaryViewDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const SummaryView = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(SummaryViewBase));

export { SummaryView, SummaryViewProps };

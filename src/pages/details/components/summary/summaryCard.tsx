import {
  Button,
  ButtonType,
  ButtonVariant,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardHeaderMain,
  CardTitle,
} from '@patternfly/react-core';
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
import { SummaryModal } from 'pages/details/components/summary/summaryModal';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { getTestProps, testIds } from 'testIds';
import { getComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { formatValue } from 'utils/formatValue';
import { styles } from './summaryCard.styles';

interface SummaryOwnProps {
  filterBy: string | number;
  groupBy: string;
  parentGroupBy: string;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
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

class SummaryBase extends React.Component<SummaryProps> {
  public state: SummaryState = {
    isBulletChartModalOpen: false,
  };

  public componentDidMount() {
    const {
      fetchReport,
      queryString,
      reportPathsType,
      reportType,
    } = this.props;
    fetchReport(reportPathsType, reportType, queryString);
  }

  public componentDidUpdate(prevProps: SummaryProps) {
    const {
      fetchReport,
      queryString,
      reportPathsType,
      reportType,
    } = this.props;
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

  private getSummary = () => {
    const { groupBy, report, reportFetchStatus } = this.props;
    return (
      <ReportSummaryItems
        idKey={groupBy as any}
        report={report}
        status={reportFetchStatus}
      >
        {({ items }) =>
          items.map(reportItem => (
            <ReportSummaryItem
              key={`${reportItem.id}-item`}
              formatOptions={{}}
              formatValue={formatValue}
              label={reportItem.label ? reportItem.label.toString() : undefined}
              totalValue={report.meta.total.cost.total.value}
              units={report.meta.total.cost.total.units}
              value={reportItem.cost}
            />
          ))
        }
      </ReportSummaryItems>
    );
  };

  private getViewAll = () => {
    const { filterBy, groupBy, parentGroupBy, reportPathsType, t } = this.props;
    const { isBulletChartModalOpen } = this.state;

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
            onClick={this.handleBulletChartModalOpen}
            type={ButtonType.button}
            variant={ButtonVariant.link}
          >
            {t('details.view_all', { groupBy })}
          </Button>
          <SummaryModal
            filterBy={filterBy}
            groupBy={groupBy}
            isOpen={isBulletChartModalOpen}
            onClose={this.handleBulletChartModalClose}
            parentGroupBy={parentGroupBy}
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
    const { groupBy, reportFetchStatus, t } = this.props;

    return (
      <Card style={styles.card}>
        <CardTitle>{t('breakdown.summary_title', { groupBy })}</CardTitle>
        <CardBody>
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
        </CardBody>
        <CardFooter>{this.getViewAll()}</CardFooter>
      </Card>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  SummaryOwnProps,
  SummaryStateProps
>(
  (
    state,
    { filterBy, groupBy, parentGroupBy, reportPathsType, reportType }
  ) => {
    const query: OcpQuery = {
      filter: {
        limit: 3,
        time_scope_units: 'month',
        time_scope_value: -1,
        resolution: 'monthly',
        [parentGroupBy]: filterBy,
      },
      group_by: { [groupBy]: '*' },
    };
    const queryString = getQuery(query);
    const report = reportSelectors.selectReport(
      state,
      reportPathsType,
      reportType,
      queryString
    );
    const reportFetchStatus = reportSelectors.selectReportFetchStatus(
      state,
      reportPathsType,
      reportType,
      queryString
    );
    return {
      queryString,
      report,
      reportFetchStatus,
      reportPathsType,
      reportType,
    };
  }
);

const mapDispatchToProps: SummaryDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const SummaryCard = translate()(
  connect(mapStateToProps, mapDispatchToProps)(SummaryBase)
);

export { SummaryCard, SummaryProps };

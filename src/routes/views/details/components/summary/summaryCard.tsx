import {
  Button,
  ButtonType,
  ButtonVariant,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Skeleton,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQuery, parseQuery, parseQueryState } from 'api/queries/query';
import type { OcpReport } from 'api/reports/ocpReports';
import type { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ReportSummaryItem, ReportSummaryItems } from 'routes/views/components/reports/reportSummary';
import { SummaryModal } from 'routes/views/details/components/summary/summaryModal';
import { CostDistributionType } from 'routes/views/utils/costDistribution';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'routes/views/utils/groupBy';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { getComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { logicalAndPrefix, logicalOrPrefix, orgUnitIdKey, platformCategoryKey } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';
import { skeletonWidth } from 'utils/skeleton';

import { styles } from './summaryCard.styles';

interface SummaryOwnProps extends RouterComponentProps, WrappedComponentProps {
  costDistribution: string;
  costType?: string;
  currency?: string;
  isPlatformCosts?: boolean;
  reportGroupBy?: string;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

interface SummaryStateProps {
  groupBy?: string;
  groupByValue?: string | number;
  query?: Query;
  report?: OcpReport;
  reportFetchStatus?: FetchStatus;
  reportQueryString?: string;
}

interface SummaryState {
  isBulletChartModalOpen: boolean;
}

interface SummaryDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type SummaryProps = SummaryOwnProps & SummaryStateProps & SummaryDispatchProps;

class SummaryBase extends React.Component<SummaryProps, SummaryState> {
  public state: SummaryState = {
    isBulletChartModalOpen: false,
  };

  public componentDidMount() {
    const { fetchReport, reportPathsType, reportType, reportQueryString } = this.props;
    fetchReport(reportPathsType, reportType, reportQueryString);
  }

  public componentDidUpdate(prevProps: SummaryProps) {
    const { costType, currency, fetchReport, reportPathsType, reportType, reportQueryString } = this.props;
    if (
      prevProps.reportQueryString !== reportQueryString ||
      prevProps.costType !== costType ||
      prevProps.currency !== currency
    ) {
      fetchReport(reportPathsType, reportType, reportQueryString);
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

  private getSummary = () => {
    const { costDistribution = CostDistributionType.total, report, reportGroupBy, reportFetchStatus } = this.props;
    return (
      <ReportSummaryItems idKey={reportGroupBy as any} report={report} status={reportFetchStatus}>
        {({ items }) =>
          items.map(reportItem => (
            <ReportSummaryItem
              formatOptions={{}}
              key={`${reportItem.id}-item`}
              label={reportItem.label ? reportItem.label.toString() : undefined}
              totalValue={report.meta.total.cost[costDistribution].value}
              units={report.meta.total.cost[costDistribution].units}
              value={reportItem.cost[costDistribution].value}
            />
          ))
        }
      </ReportSummaryItems>
    );
  };

  private getViewAll = () => {
    const {
      costDistribution,
      costType,
      currency,
      groupBy,
      intl,
      isPlatformCosts,
      query,
      reportGroupBy,
      reportPathsType,
    } = this.props;
    const { isBulletChartModalOpen } = this.state;

    const computedItems = this.getItems();
    const otherIndex = computedItems.findIndex(i => {
      const id = i.id;
      if (id && id !== null) {
        return id === 'Other' || id === 'Others';
      }
    });

    if (otherIndex !== -1) {
      // Match page header description
      const groupByValue =
        query && query.filter && query.filter.account ? query.filter.account : this.props.groupByValue;
      return (
        <div style={styles.viewAllContainer}>
          <Button
            ouiaId="view-all-btn"
            onClick={this.handleBulletChartModalOpen}
            type={ButtonType.button}
            variant={ButtonVariant.link}
          >
            {intl.formatMessage(messages.detailsViewAll, { value: reportGroupBy })}
          </Button>
          <SummaryModal
            costDistribution={costDistribution}
            costType={costType}
            currency={currency}
            groupBy={groupBy}
            groupByValue={isPlatformCosts ? platformCategoryKey : groupByValue}
            isOpen={isBulletChartModalOpen}
            onClose={this.handleBulletChartModalClose}
            query={query}
            reportGroupBy={reportGroupBy}
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
    const { intl, isPlatformCosts, reportGroupBy, reportFetchStatus } = this.props;
    const title = intl.formatMessage(messages.breakdownSummaryTitle, {
      value: isPlatformCosts ? platformCategoryKey.toLowerCase() : reportGroupBy,
    });
    return (
      <Card style={styles.card}>
        <CardTitle>
          <Title headingLevel="h2" size={TitleSizes.lg}>
            {title}
          </Title>
        </CardTitle>
        <CardBody>
          {reportFetchStatus === FetchStatus.inProgress ? (
            <>
              <Skeleton width={skeletonWidth.md} />
              <Skeleton style={styles.skeleton} width={skeletonWidth.md} />
              <Skeleton style={styles.skeleton} width={skeletonWidth.md} />
              <Skeleton style={styles.skeleton} width={skeletonWidth.md} />
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

const mapStateToProps = createMapStateToProps<SummaryOwnProps, SummaryStateProps>(
  (state, { costType, currency, reportGroupBy, reportPathsType, reportType, router }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);
    const queryState = parseQueryState<Query>(queryFromRoute);

    const groupByOrgValue = getGroupByOrgValue(queryFromRoute);
    const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(queryFromRoute);
    const groupByValue = groupByOrgValue ? groupByOrgValue : getGroupByValue(queryFromRoute);

    const query = { ...queryFromRoute };
    const reportQuery: Query = {
      cost_type: costType,
      currency,
      filter: {
        limit: 3,
        resolution: 'monthly',
        time_scope_units: 'month',
        time_scope_value: -1,
      },
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...(queryState && queryState.filter_by && queryState.filter_by),
        ...(queryFromRoute && queryFromRoute.isPlatformCosts && { category: platformCategoryKey }),
        ...(queryFromRoute &&
          queryFromRoute.filter &&
          queryFromRoute.filter.account && { [`${logicalAndPrefix}account`]: queryFromRoute.filter.account }),
        // Related to https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
        ...(groupBy && groupByValue !== '*' && { [groupBy]: groupByValue }), // group bys must appear in filter to show costs by region, account, etc
        // Workaround for https://issues.redhat.com/browse/COST-1189
        ...(queryState &&
          queryState.filter_by &&
          queryState.filter_by[orgUnitIdKey] && {
            [`${logicalOrPrefix}${orgUnitIdKey}`]: queryState.filter_by[orgUnitIdKey],
            [orgUnitIdKey]: undefined,
          }),
      },
      exclude: {
        ...(queryState && queryState.exclude && queryState.exclude),
      },
      group_by: {
        ...(reportGroupBy && { [reportGroupBy]: '*' }), // Group by all accounts, regions, etc.
      },
    };

    const reportQueryString = getQuery(reportQuery);
    const report = reportSelectors.selectReport(state, reportPathsType, reportType, reportQueryString);
    const reportFetchStatus = reportSelectors.selectReportFetchStatus(
      state,
      reportPathsType,
      reportType,
      reportQueryString
    );

    return {
      groupBy,
      groupByValue,
      query,
      report,
      reportFetchStatus,
      reportQueryString,
    };
  }
);

const mapDispatchToProps: SummaryDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const SummaryCard = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(SummaryBase)));

export default SummaryCard;

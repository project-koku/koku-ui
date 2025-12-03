import type { Query } from '@koku-ui/api/queries/query';
import { getQuery, parseQuery } from '@koku-ui/api/queries/query';
import type { OcpReport } from '@koku-ui/api/reports/ocpReports';
import type { ReportPathsType } from '@koku-ui/api/reports/report';
import type { ReportType } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
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
import type { AxiosError } from 'axios';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps, FetchStatus } from '../../../../store/common';
import { reportActions, reportSelectors } from '../../../../store/reports';
import { logicalAndPrefix, logicalOrPrefix, orgUnitIdKey, platformCategoryKey } from '../../../../utils/props';
import type { RouterComponentProps } from '../../../../utils/router';
import { withRouter } from '../../../../utils/router';
import { ComputedReportItemValueType } from '../../../components/charts/common';
import { ReportSummaryItem, ReportSummaryItems } from '../../../components/reports/reportSummary';
import { getComputedReportItems } from '../../../utils/computedReport/getComputedReportItems';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from '../../../utils/groupBy';
import { getQueryState } from '../../../utils/queryState';
import { skeletonWidth } from '../../../utils/skeleton';
import { getTimeScopeValue } from '../../../utils/timeScope';
import { SummaryModal } from './modal/summaryModal';
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
  reportError?: AxiosError;
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
    this.updateReport();
  }

  public componentDidUpdate(prevProps: SummaryProps) {
    const { costType, currency, reportQueryString } = this.props;
    if (
      prevProps.reportQueryString !== reportQueryString ||
      prevProps.costType !== costType ||
      prevProps.currency !== currency
    ) {
      this.updateReport();
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
    const { costDistribution, report, reportGroupBy, reportFetchStatus } = this.props;

    const reportItemValue = costDistribution ? costDistribution : ComputedReportItemValueType.total;

    return (
      <ReportSummaryItems
        costDistribution={costDistribution}
        idKey={reportGroupBy as any}
        report={report}
        status={reportFetchStatus}
      >
        {({ items }) =>
          items.map(reportItem => (
            <ReportSummaryItem
              formatOptions={{}}
              key={`${reportItem.id}-item`}
              label={reportItem.label ? reportItem.label.toString() : undefined}
              totalValue={report.meta.total.cost[reportItemValue].value}
              units={report.meta.total.cost[reportItemValue].units}
              value={reportItem.cost[reportItemValue]?.value}
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

  private updateReport = () => {
    const { fetchReport, reportPathsType, reportQueryString, reportType } = this.props;
    fetchReport(reportPathsType, reportType, reportQueryString);
  };

  public render() {
    const { intl, isPlatformCosts, reportGroupBy, reportFetchStatus } = this.props;
    const title = intl.formatMessage(messages.breakdownSummaryTitle, {
      value: isPlatformCosts ? platformCategoryKey.toLowerCase() : reportGroupBy,
    });
    const viewAll = this.getViewAll();
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
        {viewAll && <CardFooter>{viewAll}</CardFooter>}
      </Card>
    );
  }
}

const mapStateToProps = createMapStateToProps<SummaryOwnProps, SummaryStateProps>(
  (state, { costDistribution, costType, currency, reportGroupBy, reportPathsType, reportType, router }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);
    const queryState = getQueryState(router.location, 'details');

    const groupByOrgValue = getGroupByOrgValue(queryFromRoute);
    const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(queryFromRoute);
    const groupByValue = groupByOrgValue || getGroupByValue(queryFromRoute);

    const isFilterByExact = groupBy && groupByValue !== '*';
    const timeScopeValue = getTimeScopeValue(queryState);

    const query = { ...queryFromRoute };
    const reportQuery: Query = {
      cost_type: costType,
      currency,
      filter: {
        limit: 3,
        resolution: 'monthly',
        time_scope_units: 'month',
        time_scope_value: timeScopeValue,
      },
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...(queryState?.filter_by && queryState.filter_by),
        ...(queryFromRoute?.isPlatformCosts && { category: platformCategoryKey }),
        ...(queryFromRoute?.filter?.account && { [`${logicalAndPrefix}account`]: queryFromRoute.filter.account }),
        // Workaround for https://issues.redhat.com/browse/COST-1189
        ...(queryState?.filter_by &&
          queryState.filter_by[orgUnitIdKey] && {
            [`${logicalOrPrefix}${orgUnitIdKey}`]: queryState.filter_by[orgUnitIdKey],
            [orgUnitIdKey]: undefined,
          }),
        // Related to https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
        // Note: We're not inserting PVC information for the 'Platform' project
        ...(isFilterByExact && {
          [groupBy]: undefined, // Replace with "exact:" filter below -- see https://issues.redhat.com/browse/COST-6659
          [`exact:${groupBy}`]: groupByValue,
        }),
      },
      exclude: {
        ...(queryState?.exclude && queryState.exclude),
      },
      group_by: {
        ...(reportGroupBy && { [reportGroupBy]: '*' }), // Group by all accounts, regions, etc.
      },
      order_by: {
        cost: 'desc', // Volumes API uses implicit ordering on usage instead of cost -- see https://issues.redhat.com/browse/COST-6560
      },
      ...(costDistribution === ComputedReportItemValueType.distributed && {
        order_by: {
          distributed_cost: 'desc',
        },
      }),
    };

    const reportQueryString = getQuery(reportQuery);
    const report = reportSelectors.selectReport(state, reportPathsType, reportType, reportQueryString) as OcpReport;
    const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, reportQueryString);
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
      reportError,
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

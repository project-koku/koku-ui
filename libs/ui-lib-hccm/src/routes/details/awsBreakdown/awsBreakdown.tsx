import { ProviderType } from '@koku-ui/api/providers';
import { getProvidersQuery } from '@koku-ui/api/queries/providersQuery';
import type { Query } from '@koku-ui/api/queries/query';
import { getQuery, parseQuery } from '@koku-ui/api/queries/query';
import { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';
import { TagPathsType } from '@koku-ui/api/tags/tag';
import messages from '@koku-ui/i18n/locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { routes } from '../../../routes';
import { createMapStateToProps } from '../../../store/common';
import { FeatureToggleSelectors } from '../../../store/featureToggle';
import { providersQuery, providersSelectors } from '../../../store/providers';
import { reportActions, reportSelectors } from '../../../store/reports';
import { formatPath } from '../../../utils/paths';
import {
  breakdownDescKey,
  breakdownTitleKey,
  logicalAndPrefix,
  logicalOrPrefix,
  orgUnitIdKey,
  serviceKey,
} from '../../../utils/props';
import type { RouterComponentProps } from '../../../utils/router';
import { withRouter } from '../../../utils/router';
import { getCostType, getCurrency } from '../../../utils/sessionStorage';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from '../../utils/groupBy';
import { filterProviders } from '../../utils/providers';
import { getQueryState } from '../../utils/queryState';
import { getTimeScopeValue } from '../../utils/timeScope';
import type { BreakdownStateProps } from '../components/breakdown';
import { BreakdownBase } from '../components/breakdown';
import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';
import { Instances } from './instances';

interface AwsBreakdownDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type AwsBreakdownOwnProps = RouterComponentProps & WrappedComponentProps;

const detailsURL = formatPath(routes.awsDetails.path);
const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.aws;

const mapStateToProps = createMapStateToProps<AwsBreakdownOwnProps, BreakdownStateProps>((state, { intl, router }) => {
  const queryFromRoute = parseQuery<Query>(router.location.search);
  const queryState = getQueryState(router.location, 'details');

  const groupByOrgValue = getGroupByOrgValue(queryFromRoute);
  const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(queryFromRoute);
  const groupByValue = groupByOrgValue || getGroupByValue(queryFromRoute);

  const costType = getCostType();
  const currency = getCurrency();
  const isFilterByExact = groupBy && groupByValue !== '*' && groupBy !== orgUnitIdKey;
  const timeScopeValue = getTimeScopeValue(queryState);

  const query = { ...queryFromRoute };
  const reportQuery = {
    cost_type: costType,
    currency,
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: timeScopeValue,
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...(queryState?.filter_by && queryState.filter_by),
      ...(queryFromRoute?.filter?.account && { [`${logicalAndPrefix}account`]: queryFromRoute.filter.account }),
      // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
      ...(isFilterByExact && {
        [groupBy]: undefined, // Replace with "exact:" filter below -- see https://issues.redhat.com/browse/COST-6659
        [`exact:${groupBy}`]: groupByValue,
      }),
      // Workaround for https://issues.redhat.com/browse/COST-1189
      ...(queryState?.filter_by &&
        queryState.filter_by[orgUnitIdKey] && {
          [`${logicalOrPrefix}${orgUnitIdKey}`]: queryState.filter_by[orgUnitIdKey],
          [orgUnitIdKey]: undefined,
        }),
    },
    exclude: {
      ...(queryState?.exclude && queryState.exclude),
    },
    group_by: {
      ...(groupBy && { [groupBy]: isFilterByExact ? '*' : groupByValue }),
    },
  };

  const reportQueryString = getQuery(reportQuery);
  const report = reportSelectors.selectReport(state, reportPathsType, reportType, reportQueryString);
  const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, reportQueryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    reportType,
    reportQueryString
  );

  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  const title = queryFromRoute[breakdownTitleKey] ? queryFromRoute[breakdownTitleKey] : groupByValue;
  const isAwsEc2InstancesToggleEnabled = FeatureToggleSelectors.selectIsAwsEc2InstancesToggleEnabled(state);

  return {
    breadcrumbPath: formatPath(routes.awsDetails.path),
    costOverviewComponent: (
      <CostOverview costType={costType} currency={currency} groupBy={groupBy} query={queryFromRoute} report={report} />
    ),
    costType,
    currency,
    description: queryFromRoute[breakdownDescKey],
    detailsURL,
    emptyStateTitle: intl.formatMessage(messages.awsDetailsTitle),
    groupBy,
    groupByValue,
    historicalDataComponent: <HistoricalData costType={costType} currency={currency} timeScopeValue={timeScopeValue} />,
    ...(isAwsEc2InstancesToggleEnabled &&
      groupBy === serviceKey &&
      groupByValue === 'AmazonEC2' && {
        instancesComponent: <Instances costType={costType} currency={currency} />,
      }),
    providers: filterProviders(providers, ProviderType.aws),
    providersError,
    providersFetchStatus,
    providerType: ProviderType.aws,
    query,
    report,
    reportError,
    reportFetchStatus,
    reportType,
    reportPathsType,
    reportQueryString,
    showCostType: true,
    tagPathsType: TagPathsType.aws,
    timeScopeValue,
    title,
  };
});

const mapDispatchToProps: AwsBreakdownDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(BreakdownBase)));

import { ProviderType } from 'api/providers';
import { getQuery, parseQuery } from 'api/queries/ocpQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { Query } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { TagPathsType } from 'api/tags/tag';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { routes } from 'routes';
import type { BreakdownStateProps } from 'routes/views/details/components/breakdown';
import { BreakdownBase } from 'routes/views/details/components/breakdown';
import Recommendations from 'routes/views/recommendations/recommendations';
import { getGroupById, getGroupByValue } from 'routes/views/utils/groupBy';
import { isPlatformCosts } from 'routes/views/utils/paths';
import { filterProviders } from 'routes/views/utils/providers';
import { createMapStateToProps } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import { providersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';
import { getCurrency } from 'utils/localStorage';
import { formatPath } from 'utils/paths';
import { breakdownDescKey, breakdownTitleKey } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';

interface BreakdownDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type OcpBreakdownOwnProps = RouterComponentProps & WrappedComponentProps;

const detailsURL = formatPath(routes.ocpDetails.path);
const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.ocp;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OcpBreakdownOwnProps, BreakdownStateProps>((state, { intl, router }) => {
  const queryFromRoute = parseQuery<Query>(router.location.search);
  const groupBy = getGroupById(queryFromRoute);
  const groupByValue = getGroupByValue(queryFromRoute);
  const currency = featureFlagsSelectors.selectIsCurrencyFeatureEnabled(state) ? getCurrency() : undefined;

  const newQuery: Query = {
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...(queryFromRoute && queryFromRoute.filter_by && queryFromRoute.filter_by),
      ...(queryFromRoute &&
        queryFromRoute.filter &&
        queryFromRoute.filter.category && { category: queryFromRoute.filter.category }),
    },
    exclude: {
      ...(queryFromRoute && queryFromRoute.exclude && queryFromRoute.exclude),
    },
    group_by: {
      ...(groupBy && { [groupBy]: groupByValue }),
    },
    category: queryFromRoute.category, // Needed to restore details page state
  };

  const reportQueryString = getQuery({
    ...newQuery,
    category: undefined,
    currency,
  });
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
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  const title = queryFromRoute[breakdownTitleKey] ? queryFromRoute[breakdownTitleKey] : groupByValue;

  return {
    costOverviewComponent: (
      <CostOverview
        currency={currency}
        groupBy={groupBy}
        isPlatformCosts={isPlatformCosts(queryFromRoute)}
        report={report}
        title={title}
      />
    ),
    currency,
    description: queryFromRoute[breakdownDescKey],
    detailsURL,
    emptyStateTitle: intl.formatMessage(messages.ocpDetailsTitle),
    groupBy,
    groupByValue,
    historicalDataComponent: <HistoricalData currency={currency} />,
    isRecommendations: queryFromRoute.recommendations !== undefined,
    isRosFeatureEnabled: featureFlagsSelectors.selectIsRosFeatureEnabled(state),
    providers: filterProviders(providers, ProviderType.ocp),
    providersFetchStatus,
    providerType: ProviderType.ocp,
    query: queryFromRoute,
    recommendationsComponent: groupBy === 'project' ? <Recommendations /> : undefined,
    report,
    reportError,
    reportFetchStatus,
    reportType,
    reportPathsType,
    reportQueryString,
    tagReportPathsType: TagPathsType.ocp,
    title,
  };
});

const mapDispatchToProps: BreakdownDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const OcpBreakdown = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(BreakdownBase)));

export default OcpBreakdown;

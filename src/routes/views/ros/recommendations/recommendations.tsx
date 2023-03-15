import { Pagination, PaginationVariant } from '@patternfly/react-core';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { RosQuery } from 'api/queries/rosQuery';
import { getQuery, parseQuery } from 'api/queries/rosQuery';
import type { Ros } from 'api/ros/ros';
import { RosPathsType, RosType } from 'api/ros/ros';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Loading } from 'routes/state/loading';
import { NoData } from 'routes/state/noData';
import { NoProviders } from 'routes/state/noProviders';
import { NotAvailable } from 'routes/state/notAvailable';
import { getGroupById, getGroupByTagKey } from 'routes/views/utils/groupBy';
import {
  handleFilterAdded,
  handleFilterRemoved,
  handlePerPageSelect,
  handleSetPage,
  handleSort,
} from 'routes/views/utils/handles';
import { filterProviders, hasCurrentMonthData } from 'routes/views/utils/providers';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import { providersQuery, providersSelectors } from 'store/providers';
import { rosActions } from 'store/ros';
import { rosSelectors } from 'store/ros';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedRosItems';
import { getCurrency } from 'utils/localStorage';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './recommendations.styles';
import { RosHeader } from './rosHeader';
import { RosTable } from './rosTable';
import { RosToolbar } from './rosToolbar';

interface RecommendationsStateProps {
  groupBy?: string;
  providers: Providers;
  providersFetchStatus: FetchStatus;
  query: RosQuery;
  recommendation: Ros;
  recommendationError: AxiosError;
  recommendationFetchStatus: FetchStatus;
  recommendationQueryString: string;
}

interface RecommendationsDispatchProps {
  fetchRos: typeof rosActions.fetchRos;
}

interface RecommendationsState {
  columns: any[];
  rows: any[];
}

type RecommendationsOwnProps = RouterComponentProps & WrappedComponentProps;

type RecommendationsProps = RecommendationsStateProps & RecommendationsOwnProps & RecommendationsDispatchProps;

const baseQuery: RosQuery = {
  delta: 'cost',
  filter: {
    limit: 10,
    offset: 0,
    resolution: 'monthly',
    time_scope_units: 'month',
    time_scope_value: -1,
  },
  exclude: {},
  filter_by: {},
  group_by: {
    project: '*',
  },
  order_by: {
    cost: 'desc',
  },
};

const recommendationType = RosType.cost as any;
const recommendationPathsType = RosPathsType.recommendation as any;

class Recommendations extends React.Component<RecommendationsProps> {
  protected defaultState: RecommendationsState = {
    columns: [],
    rows: [],
  };
  public state: RecommendationsState = { ...this.defaultState };

  public componentDidMount() {
    this.updateRecommendation();
  }

  public componentDidUpdate(prevProps: RecommendationsProps, prevState: RecommendationsState) {
    const { recommendation, recommendationError, recommendationQueryString, router } = this.props;

    const newQuery = prevProps.recommendationQueryString !== recommendationQueryString;
    const noRecommendation = !recommendation && !recommendationError;
    const noLocation = !router.location.search;

    if (newQuery || noRecommendation || noLocation) {
      this.updateRecommendation();
    }
  }

  private getComputedItems = () => {
    const { query, recommendation } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);

    return getUnsortedComputedReportItems({
      report: recommendation,
      idKey: (groupByTagKey as any) || groupById,
    });
  };

  private getPagination = (isDisabled = false, isBottom = false) => {
    const { intl, query, recommendation, router } = this.props;

    const count = recommendation && recommendation.meta ? recommendation.meta.count : 0;
    const limit =
      recommendation && recommendation.meta && recommendation.meta.filter && recommendation.meta.filter.limit
        ? recommendation.meta.filter.limit
        : baseQuery.filter.limit;
    const offset =
      recommendation && recommendation.meta && recommendation.meta.filter && recommendation.meta.filter.offset
        ? recommendation.meta.filter.offset
        : baseQuery.filter.offset;
    const page = offset / limit + 1;

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={isDisabled}
        itemCount={count}
        onPerPageSelect={(event, perPage) => handlePerPageSelect(query, router, perPage)}
        onSetPage={(event, pageNumber) => handleSetPage(query, router, recommendation, pageNumber)}
        page={page}
        perPage={limit}
        titles={{
          paginationTitle: intl.formatMessage(messages.paginationTitle, {
            title: intl.formatMessage(messages.openShift),
            placement: isBottom ? 'bottom' : 'top',
          }),
        }}
        variant={isBottom ? PaginationVariant.bottom : PaginationVariant.top}
        widgetId={`exports-pagination${isBottom ? '-bottom' : ''}`}
      />
    );
  };

  private getTable = () => {
    const { query, recommendation, recommendationFetchStatus, recommendationQueryString, router } = this.props;

    return (
      <RosTable
        isLoading={recommendationFetchStatus === FetchStatus.inProgress}
        onSort={(sortType, isSortAscending) => handleSort(query, router, sortType, isSortAscending)}
        report={recommendation}
        reportQueryString={recommendationQueryString}
      />
    );
  };

  private getToolbar = (computedItems: ComputedReportItem[]) => {
    const { query, recommendation, router } = this.props;

    const isDisabled = computedItems.length === 0;
    const itemsTotal = recommendation && recommendation.meta ? recommendation.meta.count : 0;

    return (
      <RosToolbar
        isDisabled={isDisabled}
        itemsPerPage={computedItems.length}
        itemsTotal={itemsTotal}
        onFilterAdded={filter => handleFilterAdded(query, router, filter)}
        onFilterRemoved={filter => handleFilterRemoved(query, router, filter)}
        pagination={this.getPagination(isDisabled)}
        query={query}
      />
    );
  };

  public handleColumnManagementModalClose = (isOpen: boolean) => {
    this.setState({ isColumnManagementModalOpen: isOpen });
  };

  public handleColumnManagementModalOpen = () => {
    this.setState({ isColumnManagementModalOpen: true });
  };

  public handleColumnManagementModalSave = (hiddenColumns: Set<string>) => {
    this.setState({ hiddenColumns });
  };

  public handleExportModalClose = (isOpen: boolean) => {
    this.setState({ isExportModalOpen: isOpen });
  };

  public handleExportModalOpen = () => {
    this.setState({ isExportModalOpen: true });
  };

  private updateRecommendation = () => {
    const { fetchRos, recommendationQueryString } = this.props;
    fetchRos(recommendationPathsType, recommendationType, recommendationQueryString);
  };

  public render() {
    const { groupBy, intl, providers, providersFetchStatus, recommendationError, recommendationFetchStatus } =
      this.props;

    const computedItems = this.getComputedItems();
    const isDisabled = computedItems.length === 0;
    const isStandalone = groupBy === undefined;
    const title = intl.formatMessage(messages.ocpDetailsTitle);

    // Note: Providers are fetched via the AccountSettings component used by all routes
    if (recommendationError) {
      return <NotAvailable title={title} />;
    } else if (providersFetchStatus === FetchStatus.inProgress) {
      return <Loading title={title} />;
    } else if (providersFetchStatus === FetchStatus.complete) {
      // API returns empy data array for no sources
      const noProviders = providers && providers.meta && providers.meta.count === 0;

      if (noProviders) {
        return <NoProviders providerType={ProviderType.ros} title={title} />;
      }
      if (!hasCurrentMonthData(providers)) {
        return <NoData title={title} />;
      }
    }
    return (
      <div style={styles.rosDetails}>
        {isStandalone && <RosHeader />}
        <div style={isStandalone ? styles.content : undefined}>
          <div style={isStandalone ? styles.toolbarContainer : undefined}>{this.getToolbar(computedItems)}</div>
          {recommendationFetchStatus === FetchStatus.inProgress ? (
            <Loading />
          ) : (
            <>
              <div style={isStandalone ? styles.tableContainer : undefined}>{this.getTable()}</div>
              <div style={isStandalone ? styles.paginationContainer : undefined}>
                <div style={styles.pagination}>{this.getPagination(isDisabled, true)}</div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<RecommendationsOwnProps, RecommendationsStateProps>(
  (state, { router }) => {
    const queryFromRoute = parseQuery<RosQuery>(router.location.search);
    const groupBy = getGroupById(queryFromRoute);
    const currency = featureFlagsSelectors.selectIsCurrencyFeatureEnabled(state) ? getCurrency() : undefined;
    const query = {
      delta: 'cost',
      filter: {
        ...baseQuery.filter,
        ...queryFromRoute.filter,
      },
      filter_by: queryFromRoute.filter_by || baseQuery.filter_by,
      exclude: queryFromRoute.exclude || baseQuery.exclude,
      group_by: queryFromRoute.group_by || baseQuery.group_by,
      order_by: queryFromRoute.order_by || baseQuery.order_by,
      category: queryFromRoute.category,
    };
    const recommendationQueryString = getQuery({
      ...query,
      currency,
    });
    const recommendation = rosSelectors.selectRos(
      state,
      recommendationPathsType,
      recommendationType,
      recommendationQueryString
    );
    const recommendationError = rosSelectors.selectRosError(
      state,
      recommendationPathsType,
      recommendationType,
      recommendationQueryString
    );
    const recommendationFetchStatus = rosSelectors.selectRosFetchStatus(
      state,
      recommendationPathsType,
      recommendationType,
      recommendationQueryString
    );

    const providersQueryString = getProvidersQuery(providersQuery);
    const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
    const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
      state,
      ProviderType.all,
      providersQueryString
    );

    return {
      currency,
      groupBy,
      providers: filterProviders(providers, ProviderType.ocp),
      providersFetchStatus,
      query,
      recommendation,
      recommendationError,
      recommendationFetchStatus,
      recommendationQueryString,
    } as any;
  }
);

const mapDispatchToProps: RecommendationsDispatchProps = {
  fetchRos: rosActions.fetchRos,
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(Recommendations)));

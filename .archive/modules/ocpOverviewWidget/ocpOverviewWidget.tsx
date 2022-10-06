import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { getQuery, parseQuery, Query } from 'api/queries/query';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Loading } from 'routes/state/loading';
import { NoData } from 'routes/state/noData';
import { NoProviders } from 'routes/state/noProviders';
import { NotAvailable } from 'routes/state/notAvailable';
import { hasCurrentMonthData, hasPreviousMonthData } from 'routes/views/utils/providers';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpProvidersQuery, providersActions, providersSelectors } from 'store/providers';
import { userAccessActions, userAccessQuery, userAccessSelectors } from 'store/userAccess';

import OcpOverviewChart from './ocpOverviewChart';
import { baseQuery, isOcpAvailable } from './ocpOverviewUtils';
import { styles } from './ocpOverviewWidget.styles';

interface OcpOverviewWidgetOwnProps {
  chartName: string;
  title?: string; // This is just a test property
}

interface OcpOverviewWidgetStateProps {
  chartName?: string;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
  query: Query;
  queryString: string;
  title?: string; // This is just a test property
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

interface OcpOverviewWidgetDispatchProps {
  fetchProviders: typeof providersActions.fetchProviders;
  fetchUserAccess: typeof userAccessActions.fetchUserAccess;
}

interface OcpOverviewWidgetState {
  // TBD...
}

type OcpOverviewWidgetProps = OcpOverviewWidgetStateProps & OcpOverviewWidgetOwnProps & OcpOverviewWidgetDispatchProps;

class OcpOverviewWidgetBase extends React.Component<OcpOverviewWidgetProps> {
  protected defaultState: OcpOverviewWidgetState = {};
  public state: OcpOverviewWidgetState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
  }

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: OcpOverviewWidgetProps) {
    const { queryString } = this.props;

    if (prevProps.queryString !== queryString) {
      this.updateReport();
    }
  }

  private updateReport = () => {
    const { fetchProviders, fetchUserAccess, queryString } = this.props;

    fetchProviders(ProviderType.ocp, queryString);
    fetchUserAccess(UserAccessType.all, queryString);
  };

  public render() {
    const { providers, providersError, providersFetchStatus, userAccessError, userAccessFetchStatus, userAccess } =
      this.props;

    const isLoading =
      userAccessFetchStatus === FetchStatus.inProgress || providersFetchStatus === FetchStatus.inProgress;

    const title = this.props.title;
    const chartName = this.props.chartName;

    // Test for no providers
    const noProviders = !isOcpAvailable(providers, providersFetchStatus, userAccess);

    // Note: Providers are fetched via the AccountSettings component used by all routes
    if (providersError || userAccessError) {
      return <NotAvailable title={title} />;
    } else if (isLoading) {
      return <Loading title={title} />;
    } else if (noProviders) {
      return <NoProviders title={title} />;
    } else if (!(hasCurrentMonthData(providers) || hasPreviousMonthData(providers))) {
      return <NoData title={title} />;
    }

    return (
      <div style={styles.chartContent}>
        <div style={styles.chartContainer}>
          <OcpOverviewChart chartName={chartName} title={title} />
        </div>
      </div>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OcpOverviewWidgetOwnProps, OcpOverviewWidgetStateProps>(state => {
  const queryFromRoute = parseQuery<Query>(location.search);
  const query = {
    filter: {
      ...baseQuery.filter,
      ...queryFromRoute.filter,
    },
  };
  const queryString = getQuery({
    ...query,
    perspective: undefined,
    dateRange: undefined,
  });

  const providersQueryString = getProvidersQuery(ocpProvidersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.ocp, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.ocp, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.ocp,
    providersQueryString
  );

  const userAccessQueryString = getUserAccessQuery(userAccessQuery);
  const userAccess = userAccessSelectors.selectUserAccess(state, UserAccessType.all, userAccessQueryString);
  const userAccessError = userAccessSelectors.selectUserAccessError(state, UserAccessType.all, userAccessQueryString);
  const userAccessFetchStatus = userAccessSelectors.selectUserAccessFetchStatus(
    state,
    UserAccessType.all,
    userAccessQueryString
  );

  return {
    providers,
    providersError,
    providersFetchStatus,
    providersQueryString,
    query,
    queryString,
    userAccess,
    userAccessError,
    userAccessFetchStatus,
    userAccessQueryString,
  };
});

const mapDispatchToProps: OcpOverviewWidgetDispatchProps = {
  fetchProviders: providersActions.fetchProviders,
  fetchUserAccess: userAccessActions.fetchUserAccess,
};

export default connect(mapStateToProps, mapDispatchToProps)(OcpOverviewWidgetBase);

import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { getQuery, parseQuery, Query } from 'api/queries/query';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import Loading from 'pages/state/loading';
import NoData from 'pages/state/noData';
import NoProviders from 'pages/state/noProviders';
import NotAvailable from 'pages/state/notAvailable';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpProvidersQuery, providersActions, providersSelectors } from 'store/providers';
import { allUserAccessQuery, userAccessActions, userAccessSelectors } from 'store/userAccess';

import { OcpOverviewChart } from './ocpOverviewChart';
import { baseQuery, isOcpAvailable } from './ocpOverviewUtils';
import { styles } from './ocpOverviewWidget.styles';

interface OcpOverviewWidgetOwnProps extends WithTranslation {
  title?: string; // This is just a test property
}

interface OcpOverviewWidgetStateProps {
  ocpProviders: Providers;
  ocpProvidersError: AxiosError;
  ocpProvidersFetchStatus: FetchStatus;
  ocpProvidersQueryString: string;
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

  // Ensure at least one source provider has data available
  private hasCurrentMonthData = (providers: Providers) => {
    let result = false;

    if (providers && providers.data) {
      for (const provider of providers.data) {
        if (provider.current_month_data) {
          result = true;
          break;
        }
      }
    }
    return result;
  };

  private updateReport = () => {
    const { fetchProviders, fetchUserAccess, queryString } = this.props;

    fetchProviders(ProviderType.ocp, queryString);
    fetchUserAccess(UserAccessType.all, queryString);
  };

  public render() {
    const {
      ocpProviders,
      ocpProvidersError,
      ocpProvidersFetchStatus,
      userAccessError,
      userAccessFetchStatus,
      t,
      userAccess,
    } = this.props;

    const isLoading =
      userAccessFetchStatus === FetchStatus.inProgress || ocpProvidersFetchStatus === FetchStatus.inProgress;

    const title = this.props.title || t('federated_modules.ocp_overview.title');

    // Test for no providers
    const noProviders = !isOcpAvailable(ocpProviders, ocpProvidersFetchStatus, userAccess);

    // Note: Providers are fetched via the InactiveSources component used by all routes
    if (ocpProvidersError || userAccessError) {
      return <NotAvailable title={title} />;
    } else if (isLoading) {
      return <Loading title={title} />;
    } else if (noProviders) {
      return <NoProviders title={title} />;
    } else if (!this.hasCurrentMonthData(ocpProviders)) {
      return <NoData title={title} />;
    }

    return (
      <div style={styles.chartContent}>
        <div style={styles.chartContainer}>
          <OcpOverviewChart title={title} />
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

  const ocpProvidersQueryString = getProvidersQuery(ocpProvidersQuery);
  const ocpProviders = providersSelectors.selectProviders(state, ProviderType.ocp, ocpProvidersQueryString);
  const ocpProvidersError = providersSelectors.selectProvidersError(state, ProviderType.ocp, ocpProvidersQueryString);
  const ocpProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.ocp,
    ocpProvidersQueryString
  );

  const userAccessQueryString = getUserAccessQuery(allUserAccessQuery);
  const userAccess = userAccessSelectors.selectUserAccess(state, UserAccessType.all, userAccessQueryString);
  const userAccessError = userAccessSelectors.selectUserAccessError(state, UserAccessType.all, userAccessQueryString);
  const userAccessFetchStatus = userAccessSelectors.selectUserAccessFetchStatus(
    state,
    UserAccessType.all,
    userAccessQueryString
  );

  return {
    ocpProviders,
    ocpProvidersError,
    ocpProvidersFetchStatus,
    ocpProvidersQueryString,
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

const OcpOverviewWidgetConnect = connect(mapStateToProps, mapDispatchToProps)(OcpOverviewWidgetBase);

export default withTranslation()(OcpOverviewWidgetConnect);

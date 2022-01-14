import { Title, TitleSizes } from '@patternfly/react-core';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { getQuery, parseQuery, Query } from 'api/queries/query';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import { Currency } from 'components/currency';
import messages from 'locales/messages';
import { CostType } from 'pages/views/components/costType';
import { GroupBy } from 'pages/views/components/groupBy/groupBy';
import { Perspective } from 'pages/views/components/perspective/perspective';
import { hasCloudProvider } from 'pages/views/utils/providers';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  awsProvidersQuery,
  azureProvidersQuery,
  gcpProvidersQuery,
  ibmProvidersQuery,
  ocpProvidersQuery,
  providersSelectors,
} from 'store/providers';
import { allUserAccessQuery, ibmUserAccessQuery, userAccessSelectors } from 'store/userAccess';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedExplorerReportItems';
import { getLast60DaysDate } from 'utils/dateRange';
import { isBetaFeature } from 'utils/feature';
import { getCostType } from 'utils/localStorage';
import {
  hasAwsAccess,
  hasAzureAccess,
  hasGcpAccess,
  hasIbmAccess,
  isAwsAvailable,
  isAzureAvailable,
  isGcpAvailable,
  isIbmAvailable,
  isOcpAvailable,
} from 'utils/userAccess';

import { ExplorerFilter } from './explorerFilter';
import { styles } from './explorerHeader.styles';
import {
  baseQuery,
  getDateRange,
  getDateRangeDefault,
  getGroupByDefault,
  getGroupByOptions,
  getOrgReportPathsType,
  getResourcePathsType,
  getRouteForQuery,
  getTagReportPathsType,
  infrastructureAwsOcpOptions,
  infrastructureAwsOptions,
  infrastructureAzureOcpOptions,
  infrastructureAzureOptions,
  infrastructureGcpOptions,
  infrastructureIbmOptions,
  infrastructureOcpCloudOptions,
  ocpOptions,
  PerspectiveType,
} from './explorerUtils';

interface ExplorerHeaderOwnProps {
  groupBy?: string;
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue?: string);
  onGroupBySelected(value: string);
  onPerspectiveClicked(value: string);
  perspective: PerspectiveType;
}

interface ExplorerHeaderStateProps {
  awsProviders: Providers;
  awsProvidersFetchStatus: FetchStatus;
  awsProvidersQueryString: string;
  azureProviders: Providers;
  azureProvidersFetchStatus: FetchStatus;
  azureProvidersQueryString: string;
  gcpProviders: Providers;
  gcpProvidersFetchStatus: FetchStatus;
  gcpProvidersQueryString: string;
  ibmProviders: Providers;
  ibmProvidersFetchStatus: FetchStatus;
  ibmProvidersQueryString: string;
  ibmUserAccess: UserAccess;
  ibmUserAccessError: AxiosError;
  ibmUserAccessFetchStatus: FetchStatus;
  ibmUserAccessQueryString: string;
  ocpProviders: Providers;
  ocpProvidersFetchStatus: FetchStatus;
  ocpProvidersQueryString: string;
  query: Query;
  queryString: string;
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

interface ExplorerHeaderState {
  currentPerspective?: PerspectiveType;
}

type ExplorerHeaderProps = ExplorerHeaderOwnProps &
  ExplorerHeaderStateProps &
  RouteComponentProps<void> &
  WrappedComponentProps;

class ExplorerHeaderBase extends React.Component<ExplorerHeaderProps> {
  protected defaultState: ExplorerHeaderState = {
    // TBD...
  };
  public state: ExplorerHeaderState = { ...this.defaultState };

  public componentDidMount() {
    this.setState({
      currentPerspective: this.props.perspective,
    });
  }

  public componentDidUpdate(prevProps: ExplorerHeaderProps) {
    const { perspective } = this.props;

    if (prevProps.perspective !== perspective) {
      this.setState({
        currentPerspective: this.props.perspective,
      });
    }
  }

  private getPerspective = (isDisabled: boolean) => {
    const { currentPerspective } = this.state;

    const hasAws = this.isAwsAvailable();
    const hasAzure = this.isAzureAvailable();
    const hasGcp = this.isGcpAvailable();
    const hasIbm = this.isIbmAvailable();
    const hasOcp = this.isOcpAvailable();

    // Note: No need to test OCP on cloud here, since that requires at least one provider
    if (!(hasAws || hasAzure || hasGcp || hasIbm || hasOcp)) {
      return null;
    }

    // Dynamically show options if providers are available
    const options = [];
    if (hasOcp) {
      options.push(...ocpOptions);
    }
    if (this.isOcpCloudAvailable()) {
      options.push(...infrastructureOcpCloudOptions);
    }
    if (hasAws) {
      options.push(...infrastructureAwsOptions);
    }
    if (this.isAwsCloudAvailable()) {
      options.push(...infrastructureAwsOcpOptions);
    }
    if (hasGcp) {
      options.push(...infrastructureGcpOptions);
    }

    // Todo: Temp disabled -- see https://issues.redhat.com/browse/COST-1705
    //
    // if (this.isGcpCloudAvailable()) {
    //   options.push(...infrastructureGcpOcpOptions);
    // }

    if (hasIbm) {
      options.push(...infrastructureIbmOptions);
    }
    if (hasAzure) {
      options.push(...infrastructureAzureOptions);
    }
    if (this.isAzureCloudAvailable()) {
      options.push(...infrastructureAzureOcpOptions);
    }

    return (
      <Perspective
        currentItem={currentPerspective || options[0].value}
        isDisabled={isDisabled}
        onSelected={this.handlePerspectiveSelected}
        options={options}
      />
    );
  };

  private handlePerspectiveSelected = (value: string) => {
    const { history, onPerspectiveClicked, query } = this.props;

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      filter_by: undefined,
      group_by: { [getGroupByDefault(value)]: '*' },
      order_by: undefined, // Clear sort
      perspective: value,
      ...(value === PerspectiveType.aws && { cost_type: getCostType() }),
    };
    this.setState({ currentPerspective: value }, () => {
      if (onPerspectiveClicked) {
        onPerspectiveClicked(value);
      }
      history.replace(getRouteForQuery(history, newQuery, true));
    });
  };

  private handleCostTypeSelected = (value: string) => {
    const { history, query } = this.props;

    // Need param to restore cost type upon page refresh
    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      cost_type: value,
    };
    history.replace(getRouteForQuery(history, newQuery, false)); // Don't reset pagination
  };

  private isAwsAvailable = () => {
    const { awsProviders, userAccess } = this.props;
    return isAwsAvailable(userAccess, awsProviders);
  };

  private isAwsCloudAvailable = () => {
    const { awsProviders, ocpProviders, userAccess } = this.props;
    return hasAwsAccess(userAccess) && hasCloudProvider(awsProviders, ocpProviders);
  };

  private isAzureAvailable = () => {
    const { azureProviders, userAccess } = this.props;
    return isAzureAvailable(userAccess, azureProviders);
  };

  private isAzureCloudAvailable = () => {
    const { azureProviders, ocpProviders, userAccess } = this.props;
    return hasAzureAccess(userAccess) && hasCloudProvider(azureProviders, ocpProviders);
  };

  private isGcpAvailable = () => {
    const { gcpProviders, userAccess } = this.props;
    return isGcpAvailable(userAccess, gcpProviders);
  };

  private isGcpCloudAvailable = () => {
    const { gcpProviders, ocpProviders, userAccess } = this.props;
    return hasGcpAccess(userAccess) && hasCloudProvider(gcpProviders, ocpProviders);
  };

  private isIbmAvailable = () => {
    const { ibmProviders, ibmUserAccess } = this.props;
    return isIbmAvailable(ibmUserAccess, ibmProviders);
  };

  private isIbmCloudAvailable = () => {
    const { ibmProviders, ocpProviders, userAccess } = this.props;
    return hasIbmAccess(userAccess) && hasCloudProvider(ibmProviders, ocpProviders);
  };

  private isOcpAvailable = () => {
    const { ocpProviders, userAccess } = this.props;
    return isOcpAvailable(userAccess, ocpProviders);
  };

  private isOcpCloudAvailable = () => {
    const hasAwsCloud = this.isAwsCloudAvailable();
    const hasAzureCloud = this.isAzureCloudAvailable();
    const hasGcpCloud = this.isGcpCloudAvailable();
    const hasIbmCloud = this.isIbmCloudAvailable();

    return hasAwsCloud || hasAzureCloud || hasGcpCloud || hasIbmCloud;
  };

  public render() {
    const {
      awsProvidersFetchStatus,
      azureProvidersFetchStatus,
      gcpProvidersFetchStatus,
      ibmProvidersFetchStatus,
      ocpProvidersFetchStatus,
      groupBy,
      intl,
      onFilterAdded,
      onFilterRemoved,
      onGroupBySelected,
      perspective,
      query,
    } = this.props;

    // Note: No need to test OCP on cloud here, since that requires at least one provider
    const noAwsProviders = !this.isAwsAvailable() && awsProvidersFetchStatus === FetchStatus.complete;
    const noAzureProviders = !this.isAzureAvailable() && azureProvidersFetchStatus === FetchStatus.complete;
    const noGcpProviders = !this.isGcpAvailable() && gcpProvidersFetchStatus === FetchStatus.complete;
    const noIbmProviders = !this.isIbmAvailable() && ibmProvidersFetchStatus === FetchStatus.complete;
    const noOcpProviders = !this.isOcpAvailable() && ocpProvidersFetchStatus === FetchStatus.complete;
    const noProviders = noAwsProviders && noAzureProviders && noGcpProviders && noIbmProviders && noOcpProviders;

    const groupByOptions = getGroupByOptions(perspective);
    const orgReportPathsType = getOrgReportPathsType(perspective);
    const resourcePathsType = getResourcePathsType(perspective);
    const tagReportPathsType = getTagReportPathsType(perspective);

    // Fetch tags with largest date range available
    const { start_date, end_date } = getLast60DaysDate();

    return (
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
            {intl.formatMessage(messages.ExplorerTitle)}
          </Title>
          {/* Todo: Show in-progress features in beta environment only */}
          {isBetaFeature() && <Currency />}
        </div>
        <div style={styles.perspectiveContainer}>
          {this.getPerspective(noProviders)}
          <div style={styles.groupBy}>
            <GroupBy
              endDate={end_date}
              getIdKeyForGroupBy={getIdKeyForGroupBy}
              groupBy={groupBy}
              isDisabled={noProviders}
              onSelected={onGroupBySelected}
              options={groupByOptions}
              orgReportPathsType={orgReportPathsType}
              perspective={perspective}
              showOrgs={orgReportPathsType}
              showTags={tagReportPathsType}
              startDate={start_date}
              tagReportPathsType={tagReportPathsType}
            />
          </div>
          {perspective === PerspectiveType.aws && (
            <div style={styles.costType}>
              <CostType onSelect={this.handleCostTypeSelected} />
            </div>
          )}
        </div>
        <ExplorerFilter
          groupBy={groupBy}
          isDisabled={noProviders}
          onFilterAdded={onFilterAdded}
          onFilterRemoved={onFilterRemoved}
          perspective={perspective}
          query={query}
          resourcePathsType={resourcePathsType}
        />
      </header>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<ExplorerHeaderOwnProps, ExplorerHeaderStateProps>(
  (state, { perspective }) => {
    const queryFromRoute = parseQuery<Query>(location.search);
    const dateRange = getDateRangeDefault(queryFromRoute);
    const { end_date, start_date } = getDateRange(getDateRangeDefault(queryFromRoute));

    const userAccessQueryString = getUserAccessQuery(allUserAccessQuery);
    const userAccess = userAccessSelectors.selectUserAccess(state, UserAccessType.all, userAccessQueryString);
    const userAccessError = userAccessSelectors.selectUserAccessError(state, UserAccessType.all, userAccessQueryString);
    const userAccessFetchStatus = userAccessSelectors.selectUserAccessFetchStatus(
      state,
      UserAccessType.all,
      userAccessQueryString
    );

    // Ensure group_by key is not undefined
    let groupBy = queryFromRoute.group_by;
    if (!groupBy && perspective) {
      groupBy = { [getGroupByDefault(perspective)]: '*' };
    }

    const query = {
      filter: {
        ...baseQuery.filter,
        ...queryFromRoute.filter,
      },
      filter_by: queryFromRoute.filter_by || baseQuery.filter_by,
      group_by: groupBy,
      order_by: queryFromRoute.order_by,
      perspective,
      dateRange,
      start_date,
      end_date,
      ...(perspective === PerspectiveType.aws && { cost_type: queryFromRoute.cost_type }),
    };
    const queryString = getQuery({
      ...query,
      perspective: undefined,
      dateRange: undefined,
    });

    const awsProvidersQueryString = getProvidersQuery(awsProvidersQuery);
    const awsProviders = providersSelectors.selectProviders(state, ProviderType.aws, awsProvidersQueryString);
    const awsProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
      state,
      ProviderType.aws,
      awsProvidersQueryString
    );

    const azureProvidersQueryString = getProvidersQuery(azureProvidersQuery);
    const azureProviders = providersSelectors.selectProviders(state, ProviderType.azure, azureProvidersQueryString);
    const azureProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
      state,
      ProviderType.azure,
      azureProvidersQueryString
    );

    const gcpProvidersQueryString = getProvidersQuery(gcpProvidersQuery);
    const gcpProviders = providersSelectors.selectProviders(state, ProviderType.gcp, gcpProvidersQueryString);
    const gcpProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
      state,
      ProviderType.gcp,
      gcpProvidersQueryString
    );

    const ibmProvidersQueryString = getProvidersQuery(ibmProvidersQuery);
    const ibmProviders = providersSelectors.selectProviders(state, ProviderType.ibm, ibmProvidersQueryString);
    const ibmProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
      state,
      ProviderType.ibm,
      ibmProvidersQueryString
    );

    const ocpProvidersQueryString = getProvidersQuery(ocpProvidersQuery);
    const ocpProviders = providersSelectors.selectProviders(state, ProviderType.ocp, ocpProvidersQueryString);
    const ocpProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
      state,
      ProviderType.ocp,
      ocpProvidersQueryString
    );

    // Todo: temporarily request IBM separately with beta flag.
    const ibmUserAccessQueryString = getUserAccessQuery(ibmUserAccessQuery);
    const ibmUserAccess = userAccessSelectors.selectUserAccess(state, UserAccessType.ibm, ibmUserAccessQueryString);
    const ibmUserAccessError = userAccessSelectors.selectUserAccessError(
      state,
      UserAccessType.ibm,
      ibmUserAccessQueryString
    );
    const ibmUserAccessFetchStatus = userAccessSelectors.selectUserAccessFetchStatus(
      state,
      UserAccessType.ibm,
      ibmUserAccessQueryString
    );

    return {
      awsProviders,
      awsProvidersFetchStatus,
      awsProvidersQueryString,
      azureProviders,
      azureProvidersFetchStatus,
      azureProvidersQueryString,
      gcpProviders,
      gcpProvidersFetchStatus,
      gcpProvidersQueryString,
      ibmProviders,
      ibmProvidersFetchStatus,
      ibmProvidersQueryString,
      ibmUserAccess,
      ibmUserAccessError,
      ibmUserAccessFetchStatus,
      ibmUserAccessQueryString,
      ocpProviders,
      ocpProvidersFetchStatus,
      ocpProvidersQueryString,
      perspective,
      query,
      queryString,
      userAccess,
      userAccessError,
      userAccessFetchStatus,
      userAccessQueryString,
    };
  }
);

const ExplorerHeader = injectIntl(withRouter(connect(mapStateToProps, {})(ExplorerHeaderBase)));

export { ExplorerHeader, ExplorerHeaderProps };

import { Title } from '@patternfly/react-core';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { getQuery, parseQuery, Query, tagPrefix } from 'api/queries/query';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import { getGroupByTagKey } from 'pages/details/common/detailsUtils';
import { GroupBy } from 'pages/details/components/groupBy/groupBy';
import { Perspective } from 'pages/overview/perspective';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  awsProvidersQuery,
  azureProvidersQuery,
  gcpProvidersQuery,
  ocpProvidersQuery,
  providersSelectors,
} from 'store/providers';
import { allUserAccessQuery, userAccessSelectors } from 'store/userAccess';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedExplorerReportItems';

import { ExplorerFilter } from './explorerFilter';
import { styles } from './explorerHeader.styles';
import {
  baseQuery,
  getGroupByDefault,
  getGroupByOptions,
  getOrgReportPathsType,
  getPerspectiveDefault,
  getRouteForQuery,
  getTagReportPathsType,
  infrastructureAllCloudOptions,
  infrastructureAwsCloudOptions,
  infrastructureAwsOptions,
  infrastructureAzureCloudOptions,
  infrastructureAzureOptions,
  infrastructureGcpOptions,
  infrastructureOcpOptions,
  isAwsAvailable,
  isAzureAvailable,
  isGcpAvailable,
  isOcpAvailable,
  ocpOptions,
  PerspectiveType,
} from './explorerUtils';

interface ExplorerHeaderOwnProps {
  groupBy?: string;
  onGroupByClicked(value: string);
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue?: string);
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
  ocpProviders: Providers;
  ocpProvidersFetchStatus: FetchStatus;
  ocpProvidersQueryString: string;
  perspective: PerspectiveType;
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
  WithTranslation;

class ExplorerHeaderBase extends React.Component<ExplorerHeaderProps> {
  protected defaultState: ExplorerHeaderState = {
    // TBD...
  };
  public state: ExplorerHeaderState = { ...this.defaultState };

  public componentDidMount() {
    this.setState({
      currentPerspective: this.getDefaultPerspective(),
    });
  }

  private getDefaultPerspective = () => {
    const {
      awsProviders,
      awsProvidersFetchStatus,
      azureProviders,
      azureProvidersFetchStatus,
      gcpProviders,
      gcpProvidersFetchStatus,
      ocpProviders,
      ocpProvidersFetchStatus,
      perspective,
      userAccess,
    } = this.props;

    if (perspective) {
      return perspective;
    }
    if (isOcpAvailable(ocpProviders, ocpProvidersFetchStatus, userAccess)) {
      return PerspectiveType.ocp;
    }
    if (isAwsAvailable(awsProviders, awsProvidersFetchStatus, userAccess)) {
      return PerspectiveType.aws;
    }
    if (isAzureAvailable(azureProviders, azureProvidersFetchStatus, userAccess)) {
      return PerspectiveType.azure;
    }
    if (isGcpAvailable(gcpProviders, gcpProvidersFetchStatus, userAccess)) {
      return PerspectiveType.gcp;
    }
    return undefined;
  };

  private getPerspective = (isDisabled: boolean) => {
    const {
      awsProviders,
      awsProvidersFetchStatus,
      azureProviders,
      azureProvidersFetchStatus,
      gcpProviders,
      gcpProvidersFetchStatus,
      ocpProviders,
      ocpProvidersFetchStatus,
      userAccess,
    } = this.props;
    const { currentPerspective } = this.state;

    const _isAwsAvailable = isAwsAvailable(awsProviders, awsProvidersFetchStatus, userAccess);
    const _isAzureAvailable = isAzureAvailable(azureProviders, azureProvidersFetchStatus, userAccess);
    const _isGcpAvailable = isGcpAvailable(gcpProviders, gcpProvidersFetchStatus, userAccess);
    const _isOcpAvailable = isOcpAvailable(ocpProviders, ocpProvidersFetchStatus, userAccess);

    if (!(_isAwsAvailable || _isAzureAvailable || _isGcpAvailable || _isOcpAvailable)) {
      return null;
    }

    // Dynamically show options if providers are available
    const options = [];
    if (_isOcpAvailable) {
      options.push(...ocpOptions);
      options.push(...infrastructureAllCloudOptions);
    }
    if (_isAwsAvailable) {
      options.push(...infrastructureAwsOptions);
    }
    if (_isOcpAvailable && isAwsAvailable) {
      options.push(...infrastructureAwsCloudOptions);
    }
    if (_isGcpAvailable) {
      options.push(...infrastructureGcpOptions);
    }
    if (_isAzureAvailable) {
      options.push(...infrastructureAzureOptions);
    }
    if (_isOcpAvailable && isAzureAvailable) {
      options.push(...infrastructureAzureCloudOptions);
    }
    if (_isOcpAvailable) {
      options.push(...infrastructureOcpOptions);
    }

    return (
      <Perspective
        currentItem={currentPerspective || options[0].value}
        isDisabled={isDisabled}
        onItemClicked={this.handlePerspectiveClick}
        options={options}
      />
    );
  };

  private handlePerspectiveClick = (value: string) => {
    const { history, query } = this.props;

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      filter_by: undefined,
      group_by: { [getGroupByDefault(value)]: '*' },
      order_by: { cost: 'desc' },
      perspective: value,
    };
    history.replace(getRouteForQuery(history, newQuery, true));
    this.setState({ currentPerspective: value });
  };

  public render() {
    const {
      awsProviders,
      azureProviders,
      gcpProviders,
      ocpProviders,
      awsProvidersFetchStatus,
      azureProvidersFetchStatus,
      gcpProvidersFetchStatus,
      groupBy,
      ocpProvidersFetchStatus,
      onFilterAdded,
      onFilterRemoved,
      onGroupByClicked,
      perspective,
      query,
      t,
      userAccess,
    } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);

    // Test for no providers
    const noProviders = !(
      isAwsAvailable(awsProviders, awsProvidersFetchStatus, userAccess) &&
      isAzureAvailable(azureProviders, azureProvidersFetchStatus, userAccess) &&
      isGcpAvailable(gcpProviders, gcpProvidersFetchStatus, userAccess) &&
      isOcpAvailable(ocpProviders, ocpProvidersFetchStatus, userAccess)
    );

    const groupByOptions = getGroupByOptions(perspective);
    const orgReportPathsType = getOrgReportPathsType(perspective);
    const tagReportPathsType = getTagReportPathsType(perspective);

    return (
      <header style={styles.header}>
        <div>
          <Title headingLevel="h2" style={styles.title} size="2xl">
            {t('navigation.explorer')}
          </Title>
          <div style={styles.perspectiveContainer}>
            {this.getPerspective(noProviders)}
            <div style={styles.groupBy}>
              <GroupBy
                getIdKeyForGroupBy={getIdKeyForGroupBy}
                groupBy={groupBy}
                isDisabled={noProviders}
                onItemClicked={onGroupByClicked}
                options={groupByOptions}
                orgReportPathsType={orgReportPathsType}
                showOrgs={orgReportPathsType}
                showTags={tagReportPathsType}
                tagReportPathsType={tagReportPathsType}
              />
            </div>
          </div>
          <ExplorerFilter
            groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
            isDisabled={noProviders}
            onFilterAdded={onFilterAdded}
            onFilterRemoved={onFilterRemoved}
            query={query}
          />
        </div>
      </header>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<ExplorerHeaderOwnProps, ExplorerHeaderStateProps>((state, props) => {
  const queryFromRoute = parseQuery<Query>(location.search);
  const perspective = getPerspectiveDefault(queryFromRoute);
  const query = {
    filter: {
      ...baseQuery.filter,
      ...queryFromRoute.filter,
    },
    filter_by: queryFromRoute.filter_by || baseQuery.filter_by,
    group_by: queryFromRoute.group_by || { [getGroupByDefault(perspective)]: '*' } || baseQuery.group_by,
    order_by: queryFromRoute.order_by || baseQuery.order_by,
    perspective,
  };
  const queryString = getQuery({
    ...query,
    perspective: undefined,
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

  const ocpProvidersQueryString = getProvidersQuery(ocpProvidersQuery);
  const ocpProviders = providersSelectors.selectProviders(state, ProviderType.ocp, ocpProvidersQueryString);
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
    awsProviders,
    awsProvidersFetchStatus,
    awsProvidersQueryString,
    azureProviders,
    azureProvidersFetchStatus,
    azureProvidersQueryString,
    gcpProviders,
    gcpProvidersFetchStatus,
    gcpProvidersQueryString,
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
});

const ExplorerHeader = withRouter(withTranslation()(connect(mapStateToProps, {})(ExplorerHeaderBase)));

export { ExplorerHeader, ExplorerHeaderProps };

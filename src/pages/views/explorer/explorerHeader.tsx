import { Title } from '@patternfly/react-core';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { getQuery, parseQuery, Query } from 'api/queries/query';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import { GroupBy } from 'pages/views/components/groupBy/groupBy';
import { Perspective } from 'pages/views/components/perspective/perspective';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
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
import { allUserAccessQuery, gcpUserAccessQuery, ibmUserAccessQuery, userAccessSelectors } from 'store/userAccess';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedExplorerReportItems';
import { isAwsAvailable, isAzureAvailable, isGcpAvailable, isIbmAvailable, isOcpAvailable } from 'utils/userAccess';

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
  infrastructureIbmOptions,
  infrastructureOcpOptions,
  ocpOptions,
  PerspectiveType,
} from './explorerUtils';

interface ExplorerHeaderOwnProps {
  groupBy?: string;
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue?: string);
  onGroupByClicked(value: string);
  onPerspectiveClicked(value: string);
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
  gcpUserAccess: UserAccess;
  gcpUserAccessError: AxiosError;
  gcpUserAccessFetchStatus: FetchStatus;
  gcpUserAccessQueryString: string;
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
    const { perspective } = this.props;

    if (perspective) {
      return perspective;
    }
    if (this.isAwsAvailable()) {
      return PerspectiveType.aws;
    }
    if (this.isAzureAvailable()) {
      return PerspectiveType.azure;
    }
    if (this.isGcpAvailable()) {
      return PerspectiveType.gcp;
    }
    if (this.isIbmAvailable()) {
      return PerspectiveType.ibm;
    }
    if (this.isOcpAvailable()) {
      return PerspectiveType.ocp;
    }
    return undefined;
  };

  private getPerspective = (isDisabled: boolean) => {
    const { currentPerspective } = this.state;

    const aws = this.isAwsAvailable();
    const azure = this.isAzureAvailable();
    const gcp = this.isGcpAvailable();
    const ibm = this.isIbmAvailable();
    const ocp = this.isOcpAvailable();

    if (!(aws || azure || gcp || ibm || ocp)) {
      return null;
    }

    // Dynamically show options if providers are available
    const options = [];
    if (ocp) {
      options.push(...ocpOptions);
      options.push(...infrastructureAllCloudOptions);
    }
    if (aws) {
      options.push(...infrastructureAwsOptions);
    }
    if (ocp && isAwsAvailable) {
      options.push(...infrastructureAwsCloudOptions);
    }
    if (gcp) {
      options.push(...infrastructureGcpOptions);
    }
    if (ibm) {
      options.push(...infrastructureIbmOptions);
    }
    if (azure) {
      options.push(...infrastructureAzureOptions);
    }
    if (ocp && azure) {
      options.push(...infrastructureAzureCloudOptions);
    }
    if (ocp) {
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
    const { history, onPerspectiveClicked, query } = this.props;

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      filter_by: undefined,
      group_by: { [getGroupByDefault(value)]: '*' },
      // order_by: { cost: 'desc' }, // Todo: omit default sort
      order_by: undefined, // Clear sort because table columns are not a match
      perspective: value,
    };
    history.replace(getRouteForQuery(history, newQuery, true));
    this.setState({ currentPerspective: value }, () => {
      if (onPerspectiveClicked) {
        onPerspectiveClicked(value);
      }
    });
  };

  private isAwsAvailable = () => {
    const { awsProviders, awsProvidersFetchStatus, userAccess } = this.props;
    return isAwsAvailable(userAccess, awsProviders, awsProvidersFetchStatus);
  };

  private isAzureAvailable = () => {
    const { azureProviders, azureProvidersFetchStatus, userAccess } = this.props;
    return isAzureAvailable(userAccess, azureProviders, azureProvidersFetchStatus);
  };

  private isGcpAvailable = () => {
    const { gcpProviders, gcpProvidersFetchStatus, gcpUserAccess } = this.props;
    return isGcpAvailable(gcpUserAccess, gcpProviders, gcpProvidersFetchStatus);
  };

  private isIbmAvailable = () => {
    const { ibmProviders, ibmProvidersFetchStatus, ibmUserAccess } = this.props;
    return isIbmAvailable(ibmUserAccess, ibmProviders, ibmProvidersFetchStatus);
  };

  private isOcpAvailable = () => {
    const { ocpProviders, ocpProvidersFetchStatus, userAccess } = this.props;
    return isOcpAvailable(userAccess, ocpProviders, ocpProvidersFetchStatus);
  };

  public render() {
    const {
      awsProviders,
      azureProviders,
      gcpProviders,
      ibmProviders,
      ocpProviders,
      awsProvidersFetchStatus,
      azureProvidersFetchStatus,
      gcpProvidersFetchStatus,
      gcpUserAccess,
      ibmProvidersFetchStatus,
      ibmUserAccess,
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

    // Test for no providers
    const noProviders = !(
      isAwsAvailable(userAccess, awsProviders, awsProvidersFetchStatus) ||
      isAzureAvailable(userAccess, azureProviders, azureProvidersFetchStatus) ||
      isGcpAvailable(gcpUserAccess, gcpProviders, gcpProvidersFetchStatus) ||
      isIbmAvailable(ibmUserAccess, ibmProviders, ibmProvidersFetchStatus) ||
      isOcpAvailable(userAccess, ocpProviders, ocpProvidersFetchStatus)
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
                perspective={perspective}
                showOrgs={orgReportPathsType}
                showTags={tagReportPathsType}
                tagReportPathsType={tagReportPathsType}
              />
            </div>
          </div>
          <ExplorerFilter
            groupBy={groupBy}
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
  const userAccessQueryString = getUserAccessQuery(allUserAccessQuery);
  const userAccess = userAccessSelectors.selectUserAccess(state, UserAccessType.all, userAccessQueryString);
  const userAccessError = userAccessSelectors.selectUserAccessError(state, UserAccessType.all, userAccessQueryString);
  const userAccessFetchStatus = userAccessSelectors.selectUserAccessFetchStatus(
    state,
    UserAccessType.all,
    userAccessQueryString
  );

  const queryFromRoute = parseQuery<Query>(location.search);
  const perspective = getPerspectiveDefault(queryFromRoute, userAccess);

  const query = {
    filter: {
      ...baseQuery.filter,
      ...queryFromRoute.filter,
    },
    filter_by: queryFromRoute.filter_by || baseQuery.filter_by,
    group_by: queryFromRoute.group_by || { [getGroupByDefault(perspective)]: '*' } || baseQuery.group_by,
    // order_by: queryFromRoute.order_by || baseQuery.order_by, // Todo: omit default sort
    order_by: queryFromRoute.order_by,
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

  // Todo: temporarily request GCP separately with beta flag.
  const gcpUserAccessQueryString = getUserAccessQuery(gcpUserAccessQuery);
  const gcpUserAccess = userAccessSelectors.selectUserAccess(state, UserAccessType.gcp, gcpUserAccessQueryString);
  const gcpUserAccessError = userAccessSelectors.selectUserAccessError(
    state,
    UserAccessType.gcp,
    gcpUserAccessQueryString
  );
  const gcpUserAccessFetchStatus = userAccessSelectors.selectUserAccessFetchStatus(
    state,
    UserAccessType.gcp,
    gcpUserAccessQueryString
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
    gcpUserAccess,
    gcpUserAccessError,
    gcpUserAccessFetchStatus,
    gcpUserAccessQueryString,
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
});

const ExplorerHeader = withRouter(withTranslation()(connect(mapStateToProps, {})(ExplorerHeaderBase)));

export { ExplorerHeader, ExplorerHeaderProps };

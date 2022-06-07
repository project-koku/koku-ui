import { Title, TitleSizes } from '@patternfly/react-core';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { getQuery, parseQuery, Query } from 'api/queries/query';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import { ExportsLink } from 'components/exports';
import messages from 'locales/messages';
import { Currency } from 'pages/components/currency';
import { CostType } from 'pages/views/components/costType';
import { GroupBy } from 'pages/views/components/groupBy/groupBy';
import { Perspective } from 'pages/views/components/perspective/perspective';
import { filterProviders, hasCloudProvider } from 'pages/views/utils/providers';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';
import { userAccessQuery, userAccessSelectors } from 'store/userAccess';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedExplorerReportItems';
import { CostTypes } from 'utils/costType';
import { FeatureType, isFeatureVisible } from 'utils/feature';
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
  infrastructureGcpOcpOptions,
  infrastructureGcpOptions,
  infrastructureIbmOcpOptions,
  infrastructureIbmOptions,
  infrastructureOcpCloudOptions,
  ocpOptions,
  PerspectiveType,
} from './explorerUtils';

interface ExplorerHeaderOwnProps {
  costType?: CostTypes;
  groupBy?: string;
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue?: string);
  onGroupBySelected(value: string);
  onPerspectiveClicked(value: string);
  perspective: PerspectiveType;
}

interface ExplorerHeaderStateProps {
  awsProviders?: Providers;
  azureProviders?: Providers;
  gcpProviders?: Providers;
  ibmProviders?: Providers;
  ocpProviders?: Providers;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
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
    if (this.isAwsOcpAvailable()) {
      options.push(...infrastructureAwsOcpOptions);
    }
    if (hasGcp) {
      options.push(...infrastructureGcpOptions);
    }
    if (isFeatureVisible(FeatureType.gcpOcp) && this.isGcpOcpAvailable()) {
      options.push(...infrastructureGcpOcpOptions);
    }
    if (hasIbm) {
      options.push(...infrastructureIbmOptions);
    }
    // Todo: Show in-progress features in beta environment only
    if (isFeatureVisible(FeatureType.ibm) && this.isIbmOcpAvailable()) {
      options.push(...infrastructureIbmOcpOptions);
    }
    if (hasAzure) {
      options.push(...infrastructureAzureOptions);
    }
    if (this.isAzureOcpAvailable()) {
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

  private isAwsOcpAvailable = () => {
    const { awsProviders, ocpProviders, userAccess } = this.props;
    return hasAwsAccess(userAccess) && hasCloudProvider(awsProviders, ocpProviders);
  };

  private isAzureAvailable = () => {
    const { azureProviders, userAccess } = this.props;
    return isAzureAvailable(userAccess, azureProviders);
  };

  private isAzureOcpAvailable = () => {
    const { azureProviders, ocpProviders, userAccess } = this.props;
    return hasAzureAccess(userAccess) && hasCloudProvider(azureProviders, ocpProviders);
  };

  private isGcpAvailable = () => {
    const { gcpProviders, userAccess } = this.props;
    return isGcpAvailable(userAccess, gcpProviders);
  };

  private isGcpOcpAvailable = () => {
    const { gcpProviders, ocpProviders, userAccess } = this.props;
    return hasGcpAccess(userAccess) && hasCloudProvider(gcpProviders, ocpProviders);
  };

  private isIbmAvailable = () => {
    const { ibmProviders, userAccess } = this.props;
    return isIbmAvailable(userAccess, ibmProviders);
  };

  private isIbmOcpAvailable = () => {
    const { ibmProviders, ocpProviders, userAccess } = this.props;
    return hasIbmAccess(userAccess) && hasCloudProvider(ibmProviders, ocpProviders);
  };

  private isOcpAvailable = () => {
    const { ocpProviders, userAccess } = this.props;
    return isOcpAvailable(userAccess, ocpProviders);
  };

  private isOcpCloudAvailable = () => {
    const hasAwsOcp = this.isAwsOcpAvailable();
    const hasAzureOcp = this.isAzureOcpAvailable();
    const hasGcpOcp = this.isGcpOcpAvailable();
    const hasIbmOcp = this.isIbmOcpAvailable();

    return hasAwsOcp || hasAzureOcp || hasGcpOcp || hasIbmOcp;
  };

  public render() {
    const {
      costType,
      groupBy,
      intl,
      onFilterAdded,
      onFilterRemoved,
      onGroupBySelected,
      perspective,
      providersFetchStatus,
      query,
    } = this.props;

    // Note: No need to test OCP on cloud here, since that requires at least one provider
    const noAwsProviders = !this.isAwsAvailable() && providersFetchStatus === FetchStatus.complete;
    const noAzureProviders = !this.isAzureAvailable() && providersFetchStatus === FetchStatus.complete;
    const noGcpProviders = !this.isGcpAvailable() && providersFetchStatus === FetchStatus.complete;
    const noIbmProviders = !this.isIbmAvailable() && providersFetchStatus === FetchStatus.complete;
    const noOcpProviders = !this.isOcpAvailable() && providersFetchStatus === FetchStatus.complete;
    const noProviders = noAwsProviders && noAzureProviders && noGcpProviders && noIbmProviders && noOcpProviders;

    const groupByOptions = getGroupByOptions(perspective);
    const orgReportPathsType = getOrgReportPathsType(perspective);
    const resourcePathsType = getResourcePathsType(perspective);
    const tagReportPathsType = getTagReportPathsType(perspective);

    return (
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
            {intl.formatMessage(messages.ExplorerTitle)}
          </Title>
          <div style={styles.headerContentRight}>
            {/* Todo: Show in-progress features in beta environment only */}
            {isFeatureVisible(FeatureType.currency) && <Currency />}
            {isFeatureVisible(FeatureType.exports) && <ExportsLink />}
          </div>
        </div>
        <div style={styles.perspectiveContainer}>
          {this.getPerspective(noProviders)}
          <div style={styles.groupBy}>
            <GroupBy
              getIdKeyForGroupBy={getIdKeyForGroupBy}
              groupBy={groupBy}
              isDisabled={noProviders}
              onSelected={onGroupBySelected}
              options={groupByOptions}
              orgReportPathsType={orgReportPathsType}
              perspective={perspective}
              showOrgs={orgReportPathsType}
              showTags={tagReportPathsType}
              tagReportPathsType={tagReportPathsType}
            />
          </div>
          {perspective === PerspectiveType.aws && (
            <div style={styles.costType}>
              <CostType onSelect={this.handleCostTypeSelected} costType={costType} />
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
  (state, { costType, perspective }) => {
    const queryFromRoute = parseQuery<Query>(location.search);
    const dateRange = getDateRangeDefault(queryFromRoute);
    const { end_date, start_date } = getDateRange(getDateRangeDefault(queryFromRoute));

    const providersQueryString = getProvidersQuery(providersQuery);
    const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
    const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
    const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
      state,
      ProviderType.all,
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
      ...(perspective === PerspectiveType.aws && { cost_type: costType }),
    };
    const queryString = getQuery({
      ...query,
      perspective: undefined,
      dateRange: undefined,
    });

    return {
      awsProviders: filterProviders(providers, ProviderType.aws),
      azureProviders: filterProviders(providers, ProviderType.azure),
      gcpProviders: filterProviders(providers, ProviderType.gcp),
      ibmProviders: filterProviders(providers, ProviderType.ibm),
      ocpProviders: filterProviders(providers, ProviderType.ocp),
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
  }
);

const ExplorerHeader = injectIntl(withRouter(connect(mapStateToProps, {})(ExplorerHeaderBase)));

export { ExplorerHeader, ExplorerHeaderProps };

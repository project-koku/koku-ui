import type { Providers } from '@koku-ui/api/providers';
import { ProviderType } from '@koku-ui/api/providers';
import { getProvidersQuery } from '@koku-ui/api/queries/providersQuery';
import type { Query } from '@koku-ui/api/queries/query';
import { parseQuery } from '@koku-ui/api/queries/query';
import { getUserAccessQuery } from '@koku-ui/api/queries/userAccessQuery';
import type { Report } from '@koku-ui/api/reports/report';
import { ResourcePathsType } from '@koku-ui/api/resources/resource';
import type { UserAccess } from '@koku-ui/api/userAccess';
import { UserAccessType } from '@koku-ui/api/userAccess';
import messages from '@koku-ui/i18n/locales/messages';
import { Flex, FlexItem, Title, TitleSizes, Tooltip } from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { ExportsLink } from '../../components/drawers';
import { createMapStateToProps, FetchStatus } from '../../store/common';
import { FeatureToggleSelectors } from '../../store/featureToggle';
import { providersQuery, providersSelectors } from '../../store/providers';
import { userAccessQuery, userAccessSelectors } from '../../store/userAccess';
import type { RouterComponentProps } from '../../utils/router';
import { withRouter } from '../../utils/router';
import {
  hasAwsAccess,
  hasAzureAccess,
  hasGcpAccess,
  isAwsAvailable,
  isAzureAvailable,
  isGcpAvailable,
  isOcpAvailable,
} from '../../utils/userAccess';
import { CostDistribution } from '../components/costDistribution';
import { CostType } from '../components/costType';
import { Currency } from '../components/currency';
import { GroupBy } from '../components/groupBy';
import { Perspective } from '../components/perspective';
import { getIdKeyForGroupBy } from '../utils/computedReport/getComputedExplorerReportItems';
import { getTotalCost } from '../utils/cost';
import type { DateRangeType } from '../utils/dateRange';
import type { Filter } from '../utils/filter';
import { filterProviders, hasCloudProvider } from '../utils/providers';
import { getRouteForQuery } from '../utils/query';
import { ExplorerFilter } from './explorerFilter';
import { styles } from './explorerHeader.styles';
import {
  baseQuery,
  getGroupByDefault,
  getGroupByOptions,
  getOrgReportPathsType,
  getResourcePathsType,
  getTagReportPathsType,
  PerspectiveType,
} from './explorerUtils';

interface ExplorerHeaderOwnProps extends RouterComponentProps, WrappedComponentProps {
  costDistribution?: string;
  costType?: string;
  currency?: string;
  dateRangeType?: DateRangeType;
  endDate?: string;
  groupBy?: string;
  isCurrentMonthData?: boolean;
  isDataAvailable?: boolean;
  isPreviousMonthData?: boolean;
  onCostDistributionSelect(value: string);
  onCostTypeSelect(value: string);
  onCurrencySelect(value: string);
  onDateRangeSelect(value: DateRangeType);
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  onGroupBySelect(value: string);
  onPerspectiveClicked(value: string);
  perspective: PerspectiveType;
  report: Report;
  startDate?: string;
}

interface ExplorerHeaderStateProps {
  awsProviders?: Providers;
  azureProviders?: Providers;
  gcpProviders?: Providers;
  isDistributedOverhead?: boolean;
  isExportsToggleEnabled?: boolean;
  ocpProviders?: Providers;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
  query: Query;
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

interface ExplorerHeaderState {
  currentPerspective?: string;
}

type ExplorerHeaderProps = ExplorerHeaderOwnProps & ExplorerHeaderStateProps;

class ExplorerHeaderBase extends React.Component<ExplorerHeaderProps, ExplorerHeaderState> {
  protected defaultState: ExplorerHeaderState = {
    currentPerspective: this.props.perspective,
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
    const hasOcp = this.isOcpAvailable();

    // Note: No need to test "OCP on cloud" here, since that requires at least one of the providers below
    if (!(hasAws || hasAzure || hasGcp || hasOcp)) {
      return null;
    }

    return (
      <Perspective
        currentItem={currentPerspective}
        hasAws={hasAws}
        hasAwsOcp={this.isAwsOcpAvailable()}
        hasAzure={hasAzure}
        hasAzureOcp={this.isAzureOcpAvailable()}
        hasGcp={hasGcp}
        hasGcpOcp={this.isGcpOcpAvailable()}
        hasOcp={hasOcp}
        hasOcpCloud={this.isOcpCloudAvailable()}
        isDisabled={isDisabled}
        onSelect={this.handleOnPerspectiveSelect}
      />
    );
  };

  private handleOnPerspectiveSelect = (value: string) => {
    const { onPerspectiveClicked, query, router } = this.props;

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      dateRangeType: undefined, // Clear inline alert
      exclude: undefined,
      filter_by: undefined,
      group_by: { [getGroupByDefault(value)]: '*' },
      order_by: undefined, // Clear sort
      perspective: value,
    };
    this.setState({ currentPerspective: value }, () => {
      if (onPerspectiveClicked) {
        onPerspectiveClicked(value);
      }
      router.navigate(getRouteForQuery(newQuery, router.location, true), { replace: true });
    });
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

  private isOcpAvailable = () => {
    const { ocpProviders, userAccess } = this.props;
    return isOcpAvailable(userAccess, ocpProviders);
  };

  private isOcpCloudAvailable = () => {
    const hasAwsOcp = this.isAwsOcpAvailable();
    const hasAzureOcp = this.isAzureOcpAvailable();
    const hasGcpOcp = this.isGcpOcpAvailable();

    return hasAwsOcp || hasAzureOcp || hasGcpOcp;
  };

  public render() {
    const {
      costDistribution,
      costType,
      currency,
      dateRangeType,
      endDate,
      groupBy,
      intl,
      isCurrentMonthData,
      isDataAvailable,
      isExportsToggleEnabled,
      isPreviousMonthData,
      onCostDistributionSelect,
      onCostTypeSelect,
      onCurrencySelect,
      onDateRangeSelect,
      onFilterAdded,
      onFilterRemoved,
      onGroupBySelect,
      perspective,
      providers,
      providersError,
      providersFetchStatus,
      report,
      query,
      startDate,
    } = this.props;

    // Note: No need to test OCP on cloud here, since that requires at least one provider
    const noAwsProviders = !this.isAwsAvailable() && providersFetchStatus === FetchStatus.complete;
    const noAzureProviders = !this.isAzureAvailable() && providersFetchStatus === FetchStatus.complete;
    const noGcpProviders = !this.isGcpAvailable() && providersFetchStatus === FetchStatus.complete;
    const noOcpProviders = !this.isOcpAvailable() && providersFetchStatus === FetchStatus.complete;
    const noProviders = noAwsProviders && noAzureProviders && noGcpProviders && noOcpProviders;

    const groupByOptions = getGroupByOptions(perspective);
    const orgPathsType = getOrgReportPathsType(perspective);
    const resourcePathsType = getResourcePathsType(perspective);
    const tagPathsType = getTagReportPathsType(perspective);

    const showContent = report && !providersError && providers?.meta?.count > 0;
    const { cost, infrastructureCost, supplementaryCost } = getTotalCost(report, costDistribution);

    const dateRange = intl.formatDateTimeRange(new Date(startDate + 'T00:00:00'), new Date(endDate + 'T00:00:00'), {
      day: 'numeric',
      month: 'long',
    });

    return (
      <header>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} style={styles.headerContent}>
          <FlexItem>
            <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
              {intl.formatMessage(messages.explorerTitle)}
            </Title>
          </FlexItem>
          <FlexItem>
            <Currency currency={currency} onSelect={onCurrencySelect} />
            {isExportsToggleEnabled && <ExportsLink />}
          </FlexItem>
        </Flex>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} style={styles.perspectiveContainer}>
          <FlexItem>
            <Flex>
              <FlexItem>{this.getPerspective(noProviders)}</FlexItem>
              <FlexItem>
                <GroupBy
                  endDate={endDate}
                  getIdKeyForGroupBy={getIdKeyForGroupBy}
                  groupBy={groupBy}
                  isDisabled={noProviders}
                  onSelect={onGroupBySelect}
                  options={groupByOptions}
                  orgPathsType={orgPathsType}
                  perspective={perspective}
                  resourcePathsType={resourcePathsType}
                  showCostCategories={
                    resourcePathsType === ResourcePathsType.aws || resourcePathsType === ResourcePathsType.awsOcp
                  }
                  showOrgs={orgPathsType}
                  showTags={tagPathsType}
                  startDate={startDate}
                  tagPathsType={tagPathsType}
                />
              </FlexItem>
              {costDistribution && (
                <FlexItem>
                  <CostDistribution costDistribution={costDistribution} onSelect={onCostDistributionSelect} />
                </FlexItem>
              )}
              {(perspective === PerspectiveType.aws || perspective === PerspectiveType.awsOcp) && (
                <FlexItem>
                  <CostType costType={costType} onSelect={onCostTypeSelect} />
                </FlexItem>
              )}
            </Flex>
          </FlexItem>
        </Flex>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} style={styles.filterContainer}>
          <FlexItem>
            <ExplorerFilter
              dateRangeType={dateRangeType}
              endDate={endDate}
              groupBy={groupBy}
              isCurrentMonthData={isCurrentMonthData}
              isDataAvailable={isDataAvailable}
              isDisabled={noProviders}
              isPreviousMonthData={isPreviousMonthData}
              onFilterAdded={onFilterAdded}
              onFilterRemoved={onFilterRemoved}
              onDateRangeSelect={onDateRangeSelect}
              perspective={perspective}
              query={query}
              startDate={startDate}
            />
          </FlexItem>
          <FlexItem>
            {showContent && (
              <>
                {perspective === PerspectiveType.ocp ? (
                  <Tooltip
                    content={intl.formatMessage(messages.dashboardTotalCostTooltip, {
                      infrastructureCost,
                      supplementaryCost,
                    })}
                    enableFlip
                  >
                    <Title headingLevel="h2" style={styles.costValue} size={TitleSizes['4xl']}>
                      {cost}
                    </Title>
                  </Tooltip>
                ) : (
                  <Title headingLevel="h2" style={styles.costValue} size={TitleSizes['4xl']}>
                    {cost}
                  </Title>
                )}
                <div style={styles.dateTitle}>{intl.formatMessage(messages.sinceDate, { dateRange })}</div>
              </>
            )}
          </FlexItem>
        </Flex>
      </header>
    );
  }
}

const mapStateToProps = createMapStateToProps<ExplorerHeaderOwnProps, ExplorerHeaderStateProps>(
  (state, { perspective, router }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);

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
    let group_by = queryFromRoute.group_by;
    if (!group_by && perspective) {
      group_by = { [getGroupByDefault(perspective)]: '*' };
    }

    const query: any = {
      ...baseQuery,
      ...queryFromRoute,
      group_by,
    };

    return {
      awsProviders: filterProviders(providers, ProviderType.aws),
      azureProviders: filterProviders(providers, ProviderType.azure),
      gcpProviders: filterProviders(providers, ProviderType.gcp),
      isExportsToggleEnabled: FeatureToggleSelectors.selectIsExportsToggleEnabled(state),
      ocpProviders: filterProviders(providers, ProviderType.ocp),
      providers,
      providersError,
      providersFetchStatus,
      providersQueryString,
      query,
      userAccess,
      userAccessError,
      userAccessFetchStatus,
      userAccessQueryString,
    };
  }
);

const ExplorerHeader = injectIntl(withRouter(connect(mapStateToProps, {})(ExplorerHeaderBase)));

export { ExplorerHeader };
export type { ExplorerHeaderProps };

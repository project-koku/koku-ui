import { Flex, FlexItem, Title, TitleSizes } from '@patternfly/react-core';
import { OrgPathsType } from 'api/orgs/org';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { Query } from 'api/queries/query';
import type { AwsReport } from 'api/reports/awsReports';
import { ResourcePathsType } from 'api/resources/resource';
import { TagPathsType } from 'api/tags/tag';
import type { AxiosError } from 'axios';
import { ExportsLink } from 'components/drawers';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { CostType } from 'routes/components/costType';
import { Currency } from 'routes/components/currency';
import { DateRange } from 'routes/components/dateRange';
import { GroupBy } from 'routes/components/groupBy';
import { ProviderDetailsModal } from 'routes/details/components/providerStatus';
import type { ComputedAwsReportItemsParams } from 'routes/utils/computedReport/getComputedAwsReportItems';
import { getIdKeyForGroupBy } from 'routes/utils/computedReport/getComputedAwsReportItems';
import { DateRangeType } from 'routes/utils/dateRange';
import { filterProviders } from 'routes/utils/providers';
import { getRouteForQuery } from 'routes/utils/query';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { FeatureToggleSelectors } from 'store/featureToggle';
import { providersQuery, providersSelectors } from 'store/providers';
import { getSinceDateRangeString } from 'utils/dates';
import { formatCurrency } from 'utils/format';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './detailsHeader.styles';

interface DetailsHeaderOwnProps {
  currency?: string;
  costType?: string;
  groupBy?: string;
  isCurrentMonthData?: boolean;
  isPreviousMonthData?: boolean;
  onCostTypeSelect(value: string);
  onCurrencySelect(value: string);
  onGroupBySelect(value: string);
  query?: Query;
  report: AwsReport;
  timeScopeValue?: number;
}

interface DetailsHeaderStateProps {
  isAccountInfoDetailsToggleEnabled?: boolean;
  isDetailsDateRangeToggleEnabled?: boolean;
  isExportsToggleEnabled?: boolean;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString?: string;
}

interface DetailsHeaderState {
  currentDateRangeType?: string;
}

type DetailsHeaderProps = DetailsHeaderOwnProps &
  DetailsHeaderStateProps &
  RouterComponentProps &
  WrappedComponentProps;

const groupByOptions: {
  label: string;
  value: ComputedAwsReportItemsParams['idKey'];
}[] = [
  { label: 'account', value: 'account' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
];

const orgPathsType = OrgPathsType.aws;
const resourcePathsType = ResourcePathsType.aws;
const tagPathsType = TagPathsType.aws;

class DetailsHeaderBase extends React.Component<DetailsHeaderProps, any> {
  protected defaultState: DetailsHeaderState = {
    currentDateRangeType:
      this.props.timeScopeValue === -2 ? DateRangeType.previousMonth : DateRangeType.currentMonthToDate,
  };
  public state: DetailsHeaderState = { ...this.defaultState };

  private handleOnCostTypeSelect = (value: string) => {
    const { onCostTypeSelect } = this.props;

    if (onCostTypeSelect) {
      onCostTypeSelect(value);
    }
  };

  private handleOnDateRangeSelected = (value: string) => {
    const { query, router } = this.props;

    this.setState({ currentDateRangeType: value }, () => {
      const newQuery = {
        filter: {},
        ...JSON.parse(JSON.stringify(query)),
      };
      newQuery.filter.time_scope_value = value === DateRangeType.previousMonth ? -2 : -1;
      router.navigate(getRouteForQuery(newQuery, router.location, true), { replace: true });
    });
  };

  public render() {
    const {
      costType,
      currency,
      groupBy,
      intl,
      isAccountInfoDetailsToggleEnabled,
      isCurrentMonthData,
      isDetailsDateRangeToggleEnabled,
      isExportsToggleEnabled,
      isPreviousMonthData,
      onCurrencySelect,
      onGroupBySelect,
      providers,
      providersError,
      report,
      timeScopeValue,
    } = this.props;
    const { currentDateRangeType } = this.state;

    const showContent = report && !providersError && providers?.meta?.count > 0;
    const hasCost = report?.meta?.total?.cost?.total;

    return (
      <header style={styles.header}>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
              {intl.formatMessage(messages.awsDetailsTitle)}
            </Title>
          </FlexItem>
          <FlexItem style={styles.exportContainer}>
            <Currency currency={currency} onSelect={onCurrencySelect} />
            {isExportsToggleEnabled && <ExportsLink />}
          </FlexItem>
        </Flex>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} style={styles.perspectiveContainer}>
          <FlexItem>
            {isAccountInfoDetailsToggleEnabled && (
              <Flex>
                <FlexItem style={styles.status}>
                  <ProviderDetailsModal providerType={ProviderType.aws} />
                </FlexItem>
              </Flex>
            )}
            <Flex style={isAccountInfoDetailsToggleEnabled ? undefined : styles.perspective}>
              <FlexItem>
                <GroupBy
                  getIdKeyForGroupBy={getIdKeyForGroupBy}
                  groupBy={groupBy}
                  isDisabled={!showContent}
                  onSelect={onGroupBySelect}
                  options={groupByOptions}
                  orgPathsType={orgPathsType}
                  resourcePathsType={resourcePathsType}
                  showCostCategories
                  showOrgs
                  showTags
                  tagPathsType={tagPathsType}
                />
              </FlexItem>
              <FlexItem>
                <CostType costType={costType} onSelect={this.handleOnCostTypeSelect} />
              </FlexItem>
              {isDetailsDateRangeToggleEnabled && (
                <FlexItem>
                  <DateRange
                    dateRangeType={currentDateRangeType}
                    isCurrentMonthData={isCurrentMonthData}
                    isDisabled={!showContent}
                    isPreviousMonthData={isPreviousMonthData}
                    onSelect={this.handleOnDateRangeSelected}
                  />
                </FlexItem>
              )}
            </Flex>
          </FlexItem>
          <FlexItem>
            {showContent && (
              <>
                <Title headingLevel="h2" style={styles.costValue} size={TitleSizes['4xl']}>
                  {formatCurrency(
                    hasCost ? report.meta.total.cost.total.value : 0,
                    hasCost ? report.meta.total.cost.total.units : 'USD'
                  )}
                </Title>
                <div style={styles.dateTitle}>
                  {getSinceDateRangeString(undefined, timeScopeValue === -2 ? 1 : 0, true)}
                </div>
              </>
            )}
          </FlexItem>
        </Flex>
      </header>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<DetailsHeaderOwnProps, DetailsHeaderStateProps>((state, props) => {
  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  return {
    isAccountInfoDetailsToggleEnabled: FeatureToggleSelectors.selectIsAccountInfoDetailsToggleEnabled(state),
    isDetailsDateRangeToggleEnabled: FeatureToggleSelectors.selectIsDetailsDateRangeToggleEnabled(state),
    isExportsToggleEnabled: FeatureToggleSelectors.selectIsExportsToggleEnabled(state),
    providers: filterProviders(providers, ProviderType.aws),
    providersError,
    providersFetchStatus,
    providersQueryString,
  };
});

const DetailsHeader = injectIntl(withRouter(connect(mapStateToProps, {})(DetailsHeaderBase)));

export { DetailsHeader };
export type { DetailsHeaderProps };

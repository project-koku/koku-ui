import { Flex, FlexItem, Title, TitleSizes, Tooltip } from '@patternfly/react-core';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { Query } from 'api/queries/query';
import type { RhelReport } from 'api/reports/rhelReports';
import { TagPathsType } from 'api/tags/tag';
import type { AxiosError } from 'axios';
import { ExportsLink } from 'components/drawers';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Currency } from 'routes/components/currency';
import { DateRange } from 'routes/components/dateRange';
import { GroupBy } from 'routes/components/groupBy';
import { EmptyValueState } from 'routes/components/state/emptyValueState';
import { ProviderDetailsModal } from 'routes/details/components/providerStatus';
import type { ComputedRhelReportItemsParams } from 'routes/utils/computedReport/getComputedRhelReportItems';
import { getIdKeyForGroupBy } from 'routes/utils/computedReport/getComputedRhelReportItems';
import { DateRangeType } from 'routes/utils/dateRange';
import { filterProviders } from 'routes/utils/providers';
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
  groupBy?: string;
  isCurrentMonthData?: boolean;
  isPreviousMonthData?: boolean;
  onCurrencySelect(value: string);
  onDateRangeSelect(value: string);
  onGroupBySelect(value: string);
  query?: Query;
  report: RhelReport;
  timeScopeValue?: number;
}

interface DetailsHeaderStateProps {
  isAccountInfoDetailsToggleEnabled?: boolean;
  isDetailsDateRangeToggleEnabled?: boolean;
  isExportsToggleEnabled?: boolean;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
}

interface DetailsHeaderState {
  currentDateRangeType?: string;
}

interface DetailsHeaderState {}

type DetailsHeaderProps = DetailsHeaderOwnProps &
  DetailsHeaderStateProps &
  RouterComponentProps &
  WrappedComponentProps;

const groupByOptions: {
  label: string;
  value: ComputedRhelReportItemsParams['idKey'];
}[] = [
  { label: 'cluster', value: 'cluster' },
  { label: 'node', value: 'node' },
  { label: 'project', value: 'project' },
];

const tagPathsType = TagPathsType.rhel;

class DetailsHeaderBase extends React.Component<DetailsHeaderProps> {
  protected defaultState: DetailsHeaderState = {
    currentDateRangeType:
      this.props.timeScopeValue === -2 ? DateRangeType.previousMonth : DateRangeType.currentMonthToDate,
  };
  public state: DetailsHeaderState = { ...this.defaultState };

  private handleOnDateRangeSelect = (value: string) => {
    const { onDateRangeSelect } = this.props;

    this.setState({ currentDateRangeType: value }, () => {
      if (onDateRangeSelect) {
        onDateRangeSelect(value);
      }
    });
  };

  public render() {
    const {
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

    let cost: string | React.ReactNode = <EmptyValueState />;
    let supplementaryCost: string | React.ReactNode = <EmptyValueState />;
    let infrastructureCost: string | React.ReactNode = <EmptyValueState />;

    if (report?.meta?.total) {
      const hasCost = report.meta.total.cost && report.meta.total.cost.total;
      const hasSupplementaryCost = report.meta.total.supplementary && report.meta.total.supplementary.total;
      const hasInfrastructureCost = report.meta.total.infrastructure && report.meta.total.infrastructure.total;
      cost = formatCurrency(
        hasCost ? report.meta.total.cost.total.value : 0,
        hasCost ? report.meta.total.cost.total.units : 'USD'
      );
      supplementaryCost = formatCurrency(
        hasSupplementaryCost ? report.meta.total.supplementary.total.value : 0,
        hasSupplementaryCost ? report.meta.total.supplementary.total.units : 'USD'
      );
      infrastructureCost = formatCurrency(
        hasInfrastructureCost ? report.meta.total.infrastructure.total.value : 0,
        hasInfrastructureCost ? report.meta.total.infrastructure.total.units : 'USD'
      );
    }

    return (
      <header style={styles.header}>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
              {intl.formatMessage(messages.rhelDetailsTitle)}
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
                  <ProviderDetailsModal providerType={ProviderType.rhel} />
                </FlexItem>
              </Flex>
            )}
            <Flex>
              <FlexItem style={isAccountInfoDetailsToggleEnabled ? undefined : styles.perspective}>
                <GroupBy
                  getIdKeyForGroupBy={getIdKeyForGroupBy}
                  groupBy={groupBy}
                  isDisabled={!showContent}
                  onSelect={onGroupBySelect}
                  options={groupByOptions}
                  showTags
                  tagPathsType={tagPathsType}
                  timeScopeValue={timeScopeValue}
                />
              </FlexItem>
              {isDetailsDateRangeToggleEnabled && (
                <FlexItem>
                  <DateRange
                    dateRangeType={currentDateRangeType}
                    isCurrentMonthData={isCurrentMonthData}
                    isDisabled={!showContent}
                    isPreviousMonthData={isPreviousMonthData}
                    onSelect={this.handleOnDateRangeSelect}
                  />
                </FlexItem>
              )}
            </Flex>
          </FlexItem>
          <FlexItem>
            {showContent && (
              <>
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
    providers: filterProviders(providers, ProviderType.rhel),
    providersError,
    providersFetchStatus,
    providersQueryString,
  };
});

const DetailsHeader = injectIntl(withRouter(connect(mapStateToProps, {})(DetailsHeaderBase)));

export { DetailsHeader };
export type { DetailsHeaderProps };

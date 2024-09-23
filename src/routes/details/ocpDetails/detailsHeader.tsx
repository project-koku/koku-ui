import { Flex, FlexItem, Title, TitleSizes, Tooltip } from '@patternfly/react-core';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { OcpReport } from 'api/reports/ocpReports';
import { TagPathsType } from 'api/tags/tag';
import type { AxiosError } from 'axios';
import { ExportsLink } from 'components/drawers';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ComputedReportItemValueType } from 'routes/components/charts/common';
import { CostDistribution } from 'routes/components/costDistribution';
import { Currency } from 'routes/components/currency';
import { GroupBy } from 'routes/components/groupBy';
import { EmptyValueState } from 'routes/components/state/emptyValueState';
import type { ComputedOcpReportItemsParams } from 'routes/utils/computedReport/getComputedOcpReportItems';
import { getIdKeyForGroupBy } from 'routes/utils/computedReport/getComputedOcpReportItems';
import { filterProviders } from 'routes/utils/providers';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { FeatureToggleSelectors } from 'store/featureToggle';
import { providersQuery, providersSelectors } from 'store/providers';
import { getSinceDateRangeString } from 'utils/dates';
import { formatCurrency } from 'utils/format';

import { styles } from './detailsHeader.styles';

interface DetailsHeaderOwnProps {
  costDistribution?: string;
  currency?: string;
  groupBy?: string;
  onCurrencySelect(value: string);
  onCostDistributionSelect(value: string);
  onGroupBySelect(value: string);
  report: OcpReport;
}

interface DetailsHeaderStateProps {
  isExportsToggleEnabled?: boolean;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
}

interface DetailsHeaderState {
  // TBD...
}

type DetailsHeaderProps = DetailsHeaderOwnProps & DetailsHeaderStateProps & WrappedComponentProps;

const groupByOptions: {
  label: string;
  value: ComputedOcpReportItemsParams['idKey'];
}[] = [
  { label: 'cluster', value: 'cluster' },
  { label: 'node', value: 'node' },
  { label: 'project', value: 'project' },
];

const tagPathsType = TagPathsType.ocp;

class DetailsHeaderBase extends React.Component<DetailsHeaderProps, DetailsHeaderState> {
  protected defaultState: DetailsHeaderState = {};
  public state: DetailsHeaderState = { ...this.defaultState };

  public render() {
    const {
      costDistribution,
      currency,
      groupBy,
      isExportsToggleEnabled,
      onCostDistributionSelect,
      onCurrencySelect,
      onGroupBySelect,
      providers,
      providersError,
      report,
      intl,
    } = this.props;
    const showContent = report && !providersError && providers?.meta?.count > 0;
    const showCostDistribution = groupBy === 'project' && report?.meta?.distributed_overhead === true;

    let cost: string | React.ReactNode = <EmptyValueState />;
    let supplementaryCost: string | React.ReactNode = <EmptyValueState />;
    let infrastructureCost: string | React.ReactNode = <EmptyValueState />;

    const reportItemValue = costDistribution ? costDistribution : ComputedReportItemValueType.total;
    if (report?.meta?.total) {
      const hasCost = report.meta.total.cost && report.meta.total.cost[reportItemValue];
      const hasSupplementaryCost = report.meta.total.supplementary && report.meta.total.supplementary.total;
      const hasInfrastructureCost = report.meta.total.infrastructure && report.meta.total.infrastructure.total;
      cost = formatCurrency(
        hasCost ? report.meta.total.cost[reportItemValue].value : 0,
        hasCost ? report.meta.total.cost[reportItemValue].units : 'USD'
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
      <header>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
              {intl.formatMessage(messages.ocpDetailsTitle)}
            </Title>
          </FlexItem>
          <FlexItem style={styles.exportContainer}>
            <Currency currency={currency} onSelect={onCurrencySelect} />
            {isExportsToggleEnabled && <ExportsLink />}
          </FlexItem>
        </Flex>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} style={styles.perspectiveContainer}>
          <FlexItem>
            <Flex>
              <FlexItem style={styles.perspective}>
                <div style={styles.groupBy}>
                  <GroupBy
                    getIdKeyForGroupBy={getIdKeyForGroupBy}
                    groupBy={groupBy}
                    isDisabled={!showContent}
                    onSelect={onGroupBySelect}
                    options={groupByOptions}
                    showTags
                    tagPathsType={tagPathsType}
                  />
                </div>
              </FlexItem>
              {showCostDistribution && (
                <FlexItem>
                  <CostDistribution costDistribution={costDistribution} onSelect={onCostDistributionSelect} />
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
                <div style={styles.dateTitle}>{getSinceDateRangeString()}</div>
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
    isExportsToggleEnabled: FeatureToggleSelectors.selectIsExportsToggleEnabled(state),
    providers: filterProviders(providers, ProviderType.ocp),
    providersError,
    providersFetchStatus,
    providersQueryString,
  };
});

const DetailsHeader = injectIntl(connect(mapStateToProps, {})(DetailsHeaderBase));

export { DetailsHeader };
export type { DetailsHeaderProps };

import { Title, TitleSizes, Tooltip } from '@patternfly/react-core';
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
import { Currency } from 'routes/components/currency';
import { EmptyValueState } from 'routes/components/state/emptyValueState';
import { ComputedReportItemValueType } from 'routes/views/components/charts/common';
import { CostDistribution } from 'routes/views/components/costDistribution';
import { GroupBy } from 'routes/views/components/groupBy';
import type { ComputedOcpReportItemsParams } from 'routes/views/utils/computedReport/getComputedOcpReportItems';
import { getIdKeyForGroupBy } from 'routes/views/utils/computedReport/getComputedOcpReportItems';
import { filterProviders } from 'routes/views/utils/providers';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import { providersQuery, providersSelectors } from 'store/providers';
import { getSinceDateRangeString } from 'utils/dates';
import { formatCurrency } from 'utils/format';

import { styles } from './detailsHeader.styles';

interface DetailsHeaderOwnProps {
  costDistribution?: string;
  currency?: string;
  groupBy?: string;
  onCurrencySelected(value: string);
  onCostDistributionSelected(value: string);
  onGroupBySelected(value: string);
  report: OcpReport;
}

interface DetailsHeaderStateProps {
  isCostDistributionFeatureEnabled?: boolean;
  isExportsFeatureEnabled?: boolean;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
}

interface DetailsHeaderState {}

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
      isCostDistributionFeatureEnabled,
      isExportsFeatureEnabled,
      onCostDistributionSelected,
      onCurrencySelected,
      onGroupBySelected,
      providers,
      providersError,
      report,
      intl,
    } = this.props;
    const showContent = report && !providersError && providers && providers.meta && providers.meta.count > 0;
    const showCostDistribution =
      groupBy === 'project' && report && report.meta && report.meta.distributed_overhead === true;

    let cost: string | React.ReactNode = <EmptyValueState />;
    let supplementaryCost: string | React.ReactNode = <EmptyValueState />;
    let infrastructureCost: string | React.ReactNode = <EmptyValueState />;

    const reportItemValue = costDistribution ? costDistribution : ComputedReportItemValueType.total;
    if (report && report.meta && report.meta.total) {
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
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
            {intl.formatMessage(messages.ocpDetailsTitle)}
          </Title>
          <div style={styles.headerContentRight}>
            <Currency currency={currency} onSelect={onCurrencySelected} />
            {isExportsFeatureEnabled && <ExportsLink />}
          </div>
        </div>
        <div style={styles.headerContent}>
          <div style={styles.headerContentLeft}>
            <GroupBy
              getIdKeyForGroupBy={getIdKeyForGroupBy}
              groupBy={groupBy}
              isDisabled={!showContent}
              onSelected={onGroupBySelected}
              options={groupByOptions}
              showTags
              tagPathsType={tagPathsType}
            />
            {showCostDistribution && isCostDistributionFeatureEnabled && (
              <div style={styles.costDistribution}>
                <CostDistribution costDistribution={costDistribution} onSelect={onCostDistributionSelected} />
              </div>
            )}
          </div>
          {showContent && (
            <div>
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
            </div>
          )}
        </div>
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
    isCostDistributionFeatureEnabled: featureFlagsSelectors.selectIsCostDistributionFeatureEnabled(state),
    isExportsFeatureEnabled: featureFlagsSelectors.selectIsExportsFeatureEnabled(state),
    providers: filterProviders(providers, ProviderType.ocp),
    providersError,
    providersFetchStatus,
    providersQueryString,
  };
});

const DetailsHeader = injectIntl(connect(mapStateToProps, {})(DetailsHeaderBase));

export { DetailsHeader };
export type { DetailsHeaderProps };

import { Title, TitleSizes, Tooltip } from '@patternfly/react-core';
import { Providers, ProviderType } from 'api/providers';
import { getQuery, OcpQuery } from 'api/queries/ocpQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { OcpReport } from 'api/reports/ocpReports';
import { TagPathsType } from 'api/tags/tag';
import { AxiosError } from 'axios';
import { ExportsLink } from 'components/exports';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { Currency } from 'routes/components/currency';
import { EmptyValueState } from 'routes/components/state/emptyValueState';
import { GroupBy } from 'routes/views/components/groupBy';
import { filterProviders } from 'routes/views/utils/providers';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import { providersQuery, providersSelectors } from 'store/providers';
import { ComputedOcpReportItemsParams, getIdKeyForGroupBy } from 'utils/computedReport/getComputedOcpReportItems';
import { getSinceDateRangeString } from 'utils/dates';
import { formatCurrency } from 'utils/format';

import { styles } from './detailsHeader.styles';

interface DetailsHeaderOwnProps {
  currency?: string;
  groupBy?: string;
  onCurrencySelected(value: string);
  onGroupBySelected(value: string);
  report: OcpReport;
}

interface DetailsHeaderStateProps {
  isCurrencyFeatureEnabled?: boolean;
  isExportsFeatureEnabled?: boolean;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  queryString: string;
}

interface DetailsHeaderState {}

type DetailsHeaderProps = DetailsHeaderOwnProps & DetailsHeaderStateProps & WrappedComponentProps;

const baseQuery: OcpQuery = {
  delta: 'cost',
  filter: {
    time_scope_units: 'month',
    time_scope_value: -1,
    resolution: 'monthly',
  },
};

const groupByOptions: {
  label: string;
  value: ComputedOcpReportItemsParams['idKey'];
}[] = [
  { label: 'cluster', value: 'cluster' },
  { label: 'node', value: 'node' },
  { label: 'project', value: 'project' },
];

const tagReportPathsType = TagPathsType.ocp;

class DetailsHeaderBase extends React.Component<DetailsHeaderProps> {
  protected defaultState: DetailsHeaderState = {};
  public state: DetailsHeaderState = { ...this.defaultState };

  public render() {
    const {
      currency,
      groupBy,
      isCurrencyFeatureEnabled,
      isExportsFeatureEnabled,
      onCurrencySelected,
      onGroupBySelected,
      providers,
      providersError,
      report,
      intl,
    } = this.props;
    const showContent = report && !providersError && providers && providers.meta && providers.meta.count > 0;

    let cost: string | React.ReactNode = <EmptyValueState />;
    let supplementaryCost: string | React.ReactNode = <EmptyValueState />;
    let infrastructureCost: string | React.ReactNode = <EmptyValueState />;

    if (report && report.meta && report.meta.total) {
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
        <div style={styles.headerContent}>
          <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
            {intl.formatMessage(messages.ocpDetailsTitle)}
          </Title>
          <div style={styles.headerContentRight}>
            {isCurrencyFeatureEnabled && <Currency currency={currency} onSelect={onCurrencySelected} />}
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
              tagReportPathsType={tagReportPathsType}
            />
          </div>
          {Boolean(showContent) && (
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
  const queryString = getQuery(baseQuery);

  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  return {
    isCurrencyFeatureEnabled: featureFlagsSelectors.selectIsCurrencyFeatureEnabled(state),
    isExportsFeatureEnabled: featureFlagsSelectors.selectIsExportsFeatureEnabled(state),
    providers: filterProviders(providers, ProviderType.ocp),
    providersError,
    providersFetchStatus,
    queryString,
  };
});

const DetailsHeader = injectIntl(connect(mapStateToProps, {})(DetailsHeaderBase));

export { DetailsHeader, DetailsHeaderProps };

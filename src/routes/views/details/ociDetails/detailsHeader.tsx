import { Title, TitleSizes } from '@patternfly/react-core';
import { Providers, ProviderType } from 'api/providers';
import { getQuery, OciQuery } from 'api/queries/ociQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { OciReport } from 'api/reports/ociReports';
import { TagPathsType } from 'api/tags/tag';
import { AxiosError } from 'axios';
import { ExportsLink } from 'components/exports';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { Currency } from 'routes/components/currency';
import { GroupBy } from 'routes/views/components/groupBy';
import { filterProviders } from 'routes/views/utils/providers';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import { providersQuery, providersSelectors } from 'store/providers';
import { ComputedOciReportItemsParams, getIdKeyForGroupBy } from 'utils/computedReport/getComputedOciReportItems';
import { getSinceDateRangeString } from 'utils/dates';
import { formatCurrency } from 'utils/format';

import { styles } from './detailsHeader.styles';

interface DetailsHeaderOwnProps {
  currency?: string;
  groupBy?: string;
  onCurrencySelected(value: string);
  onGroupBySelected(value: string);
  report: OciReport;
}

interface DetailsHeaderStateProps {
  isCurrencyFeatureEnabled?: boolean;
  isExportsFeatureEnabled?: boolean;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  queryString?: string;
}

type DetailsHeaderProps = DetailsHeaderOwnProps & DetailsHeaderStateProps & WrappedComponentProps;

const baseQuery: OciQuery = {
  delta: 'cost',
  filter: {
    time_scope_units: 'month',
    time_scope_value: -1,
    resolution: 'monthly',
  },
};

const groupByOptions: {
  label: string;
  value: ComputedOciReportItemsParams['idKey'];
}[] = [
  { label: 'payer_tenant_id', value: 'payer_tenant_id' },
  { label: 'product_service', value: 'product_service' },
  { label: 'region', value: 'region' },
];

const tagReportPathsType = TagPathsType.oci;

class DetailsHeaderBase extends React.Component<DetailsHeaderProps> {
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

    const hasCost =
      report && report.meta && report.meta.total && report.meta.total.cost && report.meta.total.cost.total;

    return (
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
            {intl.formatMessage(messages.ociDetailsTitle)}
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
              <Title headingLevel="h2" style={styles.costValue} size={TitleSizes['4xl']}>
                {formatCurrency(
                  hasCost ? report.meta.total.cost.total.value : 0,
                  hasCost ? report.meta.total.cost.total.units : 'USD'
                )}
              </Title>
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
    providers: filterProviders(providers, ProviderType.oci),
    providersError,
    providersFetchStatus,
    queryString,
  };
});

const DetailsHeader = injectIntl(connect(mapStateToProps, {})(DetailsHeaderBase));

export { DetailsHeader, DetailsHeaderProps };

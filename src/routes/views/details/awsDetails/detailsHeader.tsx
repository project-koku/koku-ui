import { Title, TitleSizes } from '@patternfly/react-core';
import { OrgPathsType } from 'api/orgs/org';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { AwsReport } from 'api/reports/awsReports';
import { TagPathsType } from 'api/tags/tag';
import type { AxiosError } from 'axios';
import { ExportsLink } from 'components/drawers';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Currency } from 'routes/components/currency';
import { CostType } from 'routes/views/components/costType';
import { GroupBy } from 'routes/views/components/groupBy';
import { filterProviders } from 'routes/views/utils/providers';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import { providersQuery, providersSelectors } from 'store/providers';
import type { ComputedAwsReportItemsParams } from 'utils/computedReport/getComputedAwsReportItems';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedAwsReportItems';
import { getSinceDateRangeString } from 'utils/dates';
import { formatCurrency } from 'utils/format';

import { styles } from './detailsHeader.styles';

interface DetailsHeaderOwnProps {
  currency?: string;
  costType?: string;
  groupBy?: string;
  onCostTypeSelected(value: string);
  onCurrencySelected(value: string);
  onGroupBySelected(value: string);
  report: AwsReport;
}

interface DetailsHeaderStateProps {
  isExportsFeatureEnabled?: boolean;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString?: string;
}

type DetailsHeaderProps = DetailsHeaderOwnProps & DetailsHeaderStateProps & WrappedComponentProps;

const groupByOptions: {
  label: string;
  value: ComputedAwsReportItemsParams['idKey'];
}[] = [
  { label: 'account', value: 'account' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
];

const orgReportPathsType = OrgPathsType.aws;
const tagReportPathsType = TagPathsType.aws;

class DetailsHeaderBase extends React.Component<DetailsHeaderProps, any> {
  private handleCostTypeSelected = (value: string) => {
    const { onCostTypeSelected } = this.props;

    if (onCostTypeSelected) {
      onCostTypeSelected(value);
    }
  };

  public render() {
    const {
      costType,
      currency,
      groupBy,
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
            {intl.formatMessage(messages.awsDetailsTitle)}
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
              orgReportPathsType={orgReportPathsType}
              showOrgs
              showTags
              tagReportPathsType={tagReportPathsType}
            />
            <div style={styles.costType}>
              <CostType costType={costType} onSelect={this.handleCostTypeSelected} />
            </div>
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
  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  return {
    isExportsFeatureEnabled: featureFlagsSelectors.selectIsExportsFeatureEnabled(state),
    providers: filterProviders(providers, ProviderType.aws),
    providersError,
    providersFetchStatus,
    providersQueryString,
  };
});

const DetailsHeader = injectIntl(connect(mapStateToProps, {})(DetailsHeaderBase));

export { DetailsHeader };
export type { DetailsHeaderProps };

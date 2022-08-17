import { Title, TitleSizes } from '@patternfly/react-core';
import { OrgPathsType } from 'api/orgs/org';
import { Providers, ProviderType } from 'api/providers';
import { AwsQuery, getQuery } from 'api/queries/awsQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { AwsReport } from 'api/reports/awsReports';
import { TagPathsType } from 'api/tags/tag';
import { AxiosError } from 'axios';
import { ExportsLink } from 'components/exports';
import messages from 'locales/messages';
import { Currency } from 'pages/components/currency';
import { CostType } from 'pages/views/components/costType';
import { GroupBy } from 'pages/views/components/groupBy/groupBy';
import { filterProviders } from 'pages/views/utils/providers';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import { providersQuery, providersSelectors } from 'store/providers';
import { ComputedAwsReportItemsParams, getIdKeyForGroupBy } from 'utils/computedReport/getComputedAwsReportItems';
import { CostTypes } from 'utils/costType';
import { getSinceDateRangeString } from 'utils/dateRange';
import { formatCurrency } from 'utils/format';

import { styles } from './detailsHeader.styles';

interface DetailsHeaderOwnProps {
  costType?: CostTypes;
  groupBy?: string;
  onCostTypeSelected(value: string);
  onGroupBySelected(value: string);
  report: AwsReport;
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

const baseQuery: AwsQuery = {
  delta: 'cost',
  filter: {
    time_scope_units: 'month',
    time_scope_value: -1,
    resolution: 'monthly',
  },
};

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

class DetailsHeaderBase extends React.Component<DetailsHeaderProps> {
  private handleCostTypeSelected = (value: string) => {
    const { onCostTypeSelected } = this.props;

    if (onCostTypeSelected) {
      onCostTypeSelected(value);
    }
  };

  public render() {
    const {
      costType,
      groupBy,
      isCurrencyFeatureEnabled,
      isExportsFeatureEnabled,
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
            {isCurrencyFeatureEnabled && <Currency />}
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
              <CostType onSelect={this.handleCostTypeSelected} costType={costType} />
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
    providers: filterProviders(providers, ProviderType.aws),
    providersError,
    providersFetchStatus,
    queryString,
  };
});

const DetailsHeader = injectIntl(connect(mapStateToProps, {})(DetailsHeaderBase));

export { DetailsHeader, DetailsHeaderProps };

import { Title } from '@patternfly/react-core';
import { Providers, ProviderType } from 'api/providers';
import { AzureQuery, getQuery } from 'api/queries/azureQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { AzureReport } from 'api/reports/azureReports';
import { TagPathsType } from 'api/tags/tag';
import { AxiosError } from 'axios';
import { GroupBy } from 'pages/views/components/groupBy/groupBy';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { azureProvidersQuery, providersSelectors } from 'store/providers';
import { ComputedAzureReportItemsParams, getIdKeyForGroupBy } from 'utils/computedReport/getComputedAzureReportItems';
import { getSinceDateRangeString } from 'utils/dateRange';
import { formatCurrency } from 'utils/formatValue';

import { styles } from './detailsHeader.styles';

interface DetailsHeaderOwnProps {
  groupBy?: string;
  onGroupByClicked(value: string);
  report: AzureReport;
}

interface DetailsHeaderStateProps {
  queryString?: string;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
}

type DetailsHeaderProps = DetailsHeaderOwnProps & DetailsHeaderStateProps & WithTranslation;

const baseQuery: AzureQuery = {
  delta: 'cost',
  filter: {
    time_scope_units: 'month',
    time_scope_value: -1,
    resolution: 'monthly',
  },
};

const groupByOptions: {
  label: string;
  value: ComputedAzureReportItemsParams['idKey'];
}[] = [
  { label: 'subscription_guid', value: 'subscription_guid' },
  { label: 'service_name', value: 'service_name' },
  { label: 'resource_location', value: 'resource_location' },
];

const tagReportPathsType = TagPathsType.azure;

class DetailsHeaderBase extends React.Component<DetailsHeaderProps> {
  public render() {
    const { groupBy, onGroupByClicked, providers, providersError, report, t } = this.props;
    const showContent = report && !providersError && providers && providers.meta && providers.meta.count > 0;

    const hasCost =
      report && report.meta && report.meta.total && report.meta.total.cost && report.meta.total.cost.total;

    return (
      <header style={styles.header}>
        <div>
          <Title headingLevel="h2" style={styles.title} size="2xl">
            {t('navigation.azure_details')}
          </Title>
          <GroupBy
            getIdKeyForGroupBy={getIdKeyForGroupBy}
            groupBy={groupBy}
            isDisabled={!showContent}
            onItemClicked={onGroupByClicked}
            options={groupByOptions}
            showTags
            tagReportPathsType={tagReportPathsType}
          />
        </div>
        {Boolean(showContent) && (
          <div>
            <Title headingLevel="h2" style={styles.costValue} size="4xl">
              {formatCurrency(hasCost ? report.meta.total.cost.total.value : 0)}
            </Title>
            <div style={styles.dateTitle}>{getSinceDateRangeString()}</div>
          </div>
        )}
      </header>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<DetailsHeaderOwnProps, DetailsHeaderStateProps>((state, props) => {
  const queryString = getQuery(baseQuery);
  const providersQueryString = getProvidersQuery(azureProvidersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.azure, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.azure, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.azure,
    providersQueryString
  );

  return {
    providers,
    providersError,
    providersFetchStatus,
    queryString,
  };
});

const DetailsHeader = withTranslation()(connect(mapStateToProps, {})(DetailsHeaderBase));

export { DetailsHeader, DetailsHeaderProps };

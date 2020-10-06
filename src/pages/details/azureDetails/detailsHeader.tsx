import { Title } from '@patternfly/react-core';
import { Providers, ProviderType } from 'api/providers';
import { AzureQuery, getQuery } from 'api/queries/azureQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { AzureReport } from 'api/reports/azureReports';
import { ReportPathsType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { GroupBy } from 'pages/details/components/groupBy/groupBy';
import { TertiaryNav, TertiaryNavItem } from 'pages/details/components/nav/tertiaryNav';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
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

type DetailsHeaderProps = DetailsHeaderOwnProps & DetailsHeaderStateProps & InjectedTranslateProps;

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

const reportPathsType = ReportPathsType.azure;

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
            {t('navigation.infrastructure_details')}
          </Title>
          <div style={styles.nav}>
            <TertiaryNav activeItem={TertiaryNavItem.azure} />
          </div>
          <GroupBy
            getIdKeyForGroupBy={getIdKeyForGroupBy}
            groupBy={groupBy}
            isDisabled={!showContent}
            onItemClicked={onGroupByClicked}
            options={groupByOptions}
            reportPathsType={reportPathsType}
            showTags
          />
        </div>
        {Boolean(showContent) && (
          <div style={styles.cost}>
            <Title headingLevel="h2" style={styles.costValue} size="4xl">
              {formatCurrency(hasCost ? report.meta.total.cost.total.value : 0)}
            </Title>
            <div style={styles.costLabel}>
              <div style={styles.costLabelUnit}>{t('azure_details.total_cost')}</div>
              <div style={styles.costLabelDate}>{getSinceDateRangeString()}</div>
            </div>
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

const DetailsHeader = translate()(connect(mapStateToProps, {})(DetailsHeaderBase));

export { DetailsHeader, DetailsHeaderProps };

import { Title } from '@patternfly/react-core';
import { OrgPathsType } from 'api/orgs/org';
import { Providers, ProviderType } from 'api/providers';
import { AwsQuery, getQuery } from 'api/queries/awsQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { Query, tagPrefix } from 'api/queries/query';
import { AwsReport } from 'api/reports/awsReports';
import { TagPathsType } from 'api/tags/tag';
import { AxiosError } from 'axios';
import { getGroupByTagKey } from 'pages/details/common/detailsUtils';
import { GroupBy } from 'pages/details/components/groupBy/groupBy';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { awsProvidersQuery, providersSelectors } from 'store/providers';
import { ComputedAwsReportItemsParams, getIdKeyForGroupBy } from 'utils/computedReport/getComputedAwsReportItems';

import { ExplorerFilter } from './explorerFilter';
import { styles } from './explorerHeader.styles';

interface ExplorerHeaderOwnProps {
  groupBy?: string;
  onGroupByClicked(value: string);
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue?: string);
  report: AwsReport;
  query?: Query;
}

interface ExplorerHeaderStateProps {
  queryString?: string;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
}

type ExplorerHeaderProps = ExplorerHeaderOwnProps & ExplorerHeaderStateProps & WithTranslation;

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

class ExplorerHeaderBase extends React.Component<ExplorerHeaderProps> {
  public render() {
    const {
      groupBy,
      onFilterAdded,
      onFilterRemoved,
      onGroupByClicked,
      providers,
      providersError,
      query,
      report,
      t,
    } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);
    const showContent = report && !providersError && providers && providers.meta && providers.meta.count > 0;

    return (
      <header style={styles.header}>
        <div>
          <Title headingLevel="h2" style={styles.title} size="2xl">
            {t('navigation.explorer')}
          </Title>
          <GroupBy
            getIdKeyForGroupBy={getIdKeyForGroupBy}
            groupBy={groupBy}
            isDisabled={!showContent}
            onItemClicked={onGroupByClicked}
            options={groupByOptions}
            orgReportPathsType={orgReportPathsType}
            showOrgs
            showTags
            tagReportPathsType={tagReportPathsType}
          />
          <ExplorerFilter
            groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
            isDisabled={!showContent}
            onFilterAdded={onFilterAdded}
            onFilterRemoved={onFilterRemoved}
            query={query}
          />
        </div>
      </header>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<ExplorerHeaderOwnProps, ExplorerHeaderStateProps>((state, props) => {
  const queryString = getQuery(baseQuery);
  const providersQueryString = getProvidersQuery(awsProvidersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.aws, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.aws, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.aws,
    providersQueryString
  );

  return {
    providers,
    providersError,
    providersFetchStatus,
    queryString,
  };
});

const ExplorerHeader = withTranslation()(connect(mapStateToProps, {})(ExplorerHeaderBase));

export { ExplorerHeader, ExplorerHeaderProps };

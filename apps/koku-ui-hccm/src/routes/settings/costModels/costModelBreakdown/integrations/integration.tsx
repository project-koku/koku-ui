import { Card, CardBody, CardTitle, Pagination, PaginationVariant, Title, TitleSizes } from '@patternfly/react-core';
import type { CostModel, CostModelProvider } from 'api/costModels';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { Query } from 'api/queries/query';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import { getSourceType } from 'routes/settings/costModels/costModel/utils';
import { filterProviders } from 'routes/utils/providers';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';

import { NoIntegrationState } from './components/state';
import { styles } from './integration.styles';
import { IntegrationTable } from './integrationTable';
import { IntegrationToolbar } from './integrationToolbar';
import { getFilteredSources, getPaginatedSources } from './utils';

interface IntegrationOwnProps {
  canWrite?: boolean;
  costModel?: CostModel;
  onAdd?: (uuids: string[]) => void;
  onDelete?: (uuids: string[]) => void;
}

export interface IntegrationMapProps {
  costModel?: CostModel;
  pageNumber?: number;
  perPage?: number;
  query?: Query;
}

export interface IntegrationStateProps {
  providers?: Providers;
  providersError?: AxiosError;
  providersFetchStatus?: FetchStatus;
  providersQueryString?: string;
  sources: CostModelProvider[];
  sourcesTotal: number; // Total number of filtered (unpaginated) sources
}

type IntegrationProps = IntegrationOwnProps;

const baseQuery: Query = {
  limit: 10,
  offset: 0,
  filter_by: {},
  order_by: {
    name: 'asc',
  },
};

const Integration: React.FC<IntegrationProps> = ({ canWrite, costModel, onAdd, onDelete }) => {
  const intl = useIntl();

  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(baseQuery.limit);
  const [query, setQuery] = useState({ ...baseQuery });

  const { providers, providersError, providersFetchStatus, sources, sourcesTotal } = useMapToProps({
    costModel,
    pageNumber,
    perPage,
    query,
  });

  const hasFilters = query?.filter_by?.name?.length > 0 || query?.filter_by?.metrics?.length > 0;
  const hasNoSources = sources?.length === 0 && !hasFilters;
  const isLoading = providersFetchStatus === FetchStatus.inProgress;

  // Getters

  const getPagination = (isBottom = false) => {
    const offset = pageNumber * perPage - perPage;
    const page = Math.trunc(offset / perPage + 1);

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={hasNoSources}
        itemCount={sourcesTotal}
        onPerPageSelect={(_event, value) => handleOnPerPageSelect(value)}
        onSetPage={(_event, value) => handleOnSetPage(value)}
        page={page}
        perPage={perPage}
        titles={{
          paginationAriaLabel: intl.formatMessage(messages.paginationTitle, {
            title: intl.formatMessage(messages.openShift),
            placement: isBottom ? 'bottom' : 'top',
          }),
        }}
        variant={isBottom ? PaginationVariant.bottom : PaginationVariant.top}
        widgetId={`pagination${isBottom ? '-bottom' : ''}`}
      />
    );
  };

  const getTable = () => {
    return (
      <IntegrationTable
        canWrite={canWrite}
        costModel={costModel}
        filterBy={query.filter_by}
        isDisabled={hasNoSources}
        isLoading={isLoading}
        orderBy={query.order_by}
        onDelete={handleOnDelete}
        providers={providers?.data}
        sources={sources}
      />
    );
  };

  const getToolbar = () => {
    return (
      <IntegrationToolbar
        canWrite={canWrite}
        costModel={costModel}
        onAdd={handleOnAdd}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        pagination={getPagination()}
        query={query}
      />
    );
  };

  // Handlers

  const handleOnAdd = (uuids: string[]) => {
    setPageNumber(1);
    onAdd?.(uuids);
  };

  const handleOnFilterAdded = filter => {
    const newQuery = queryUtils.handleOnFilterAdded(query, filter);
    setQuery(newQuery);
    setPageNumber(1); // Reset pagination
  };

  const handleOnFilterRemoved = filter => {
    const newQuery = queryUtils.handleOnFilterRemoved(query, filter);
    setQuery(newQuery);
    setPageNumber(1); // Reset pagination
  };

  const handleOnPerPageSelect = value => {
    setPerPage(value);
    setPageNumber(1); // Reset pagination
  };

  const handleOnDelete = (uuids: string[]) => {
    setPageNumber(1);
    onDelete?.(uuids);
  };

  const handleOnSetPage = value => {
    setPageNumber(value);
  };

  if (providersError) {
    return <NotAvailable />;
  }

  return (
    <Card>
      <CardTitle>
        <Title headingLevel="h2" size={TitleSizes.md} style={styles.sourceTypeTitle}>
          {intl.formatMessage(messages.sourceType)}: {costModel?.source_type ?? ''}
        </Title>
      </CardTitle>
      <CardBody>
        {!hasNoSources || isLoading ? (
          <>
            <div style={styles.tableContainer}>
              {getToolbar()}
              {isLoading ? (
                <LoadingState />
              ) : (
                <>
                  {getTable()}
                  <div style={styles.paginationContainer}>{getPagination(true)}</div>
                </>
              )}
            </div>
          </>
        ) : (
          <NoIntegrationState canWrite={canWrite} costModel={costModel} onAdd={handleOnAdd} />
        )}
      </CardBody>
    </Card>
  );
};

const useMapToProps = ({ costModel, pageNumber, perPage, query }: IntegrationMapProps): IntegrationStateProps => {
  const providerType = costModel?.source_type ? getSourceType(costModel?.source_type) : ProviderType.all;

  // PermissionsWrapper has already made an API request
  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = useSelector((state: RootState) =>
    providersSelectors.selectProviders(state, ProviderType.all, providersQueryString)
  );
  const providersError = useSelector((state: RootState) =>
    providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString)
  );
  const providersFetchStatus = useSelector((state: RootState) =>
    providersSelectors.selectProvidersFetchStatus(state, ProviderType.all, providersQueryString)
  );

  // Apply filter and paginate
  const filteredSources = getFilteredSources(costModel?.sources, query?.filter_by);
  const paginatedSources = getPaginatedSources(filteredSources, pageNumber, perPage);

  return {
    providers: filterProviders(providers, providerType),
    providersError,
    providersFetchStatus,
    sources: paginatedSources,
    sourcesTotal: filteredSources?.length ?? 0,
  };
};

export { Integration };

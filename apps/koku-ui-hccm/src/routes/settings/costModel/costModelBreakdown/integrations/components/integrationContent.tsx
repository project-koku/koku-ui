import { Content, ContentVariants, Pagination, PaginationVariant } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import type { Providers } from 'api/providers';
import { type Provider, ProviderType } from 'api/providers';
import { getQuery, type Query } from 'api/queries/query';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { NoProviders } from 'routes/components/page/noProviders';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import { getSourceType } from 'routes/settings/costModel/costModels/utils';
import priceList from 'routes/settings/costModelsDeprecated/costModelWizard/priceList';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { providersActions, providersSelectors } from 'store/providers';

import { styles } from './integrationContent.styles';
import { IntegrationContentTable } from './integrationContentTable';
import { IntegrationContentToolbar } from './integrationContentToolbar';

interface IntegrationContentOwnProps {
  canWrite?: boolean;
  costModel?: CostModel;
  onAdd?: (providers: Provider[]) => void;
  onDisabled?: (value: boolean) => void;
}

export interface IntegrationContentMapProps {
  costModel?: CostModel;
  query?: Query;
}

export interface IntegrationContentStateProps {
  providers?: Providers;
  providersError?: AxiosError;
  providersFetchStatus?: FetchStatus;
}

export interface IntegrationContentHandle {
  // Builds the rate from form state and invokes onSave
  save: () => void;
}

type IntegrationContentProps = IntegrationContentOwnProps;

const baseQuery: Query = {
  limit: 5,
  offset: 0,
  filter_by: {},
};

const IntegrationContent = forwardRef<IntegrationContentHandle, IntegrationContentProps>(
  ({ canWrite, costModel, onAdd, onDisabled }, ref) => {
    const intl = useIntl();

    /** Latest save handler for imperative `submit()` — updated in layout effect (not during render). */
    const currentHandlerRef = useRef<() => void>(() => {});

    const [query, setQuery] = useState({ ...baseQuery });

    const [selectedItems, setSelectedItems] = useState<Provider[]>([]);
    const [selectedItemsBaseline, setSelectedItemsBaseline] = useState<Provider[]>([]);

    const { providers, providersError, providersFetchStatus } = useMapToProps({ costModel, query });

    const isSelectedItemsDirty =
      selectedItems.length !== selectedItemsBaseline.length ||
      selectedItems.filter(item => selectedItemsBaseline.find(baselineItem => baselineItem.uuid === item.uuid))
        ?.length !== selectedItemsBaseline.length;
    const hasNoPriceLists = providers?.data?.length === 0;
    const hasUnsavedChanges = isSelectedItemsDirty;
    const isLoading = providersFetchStatus === FetchStatus.inProgress;
    const isSaveDisabled = !hasUnsavedChanges || hasNoPriceLists;

    const getPagination = (isBottom = false) => {
      const count = providers?.meta?.count ?? 0;
      const limit = providers?.meta?.limit ?? baseQuery.limit;
      const offset = providers?.meta?.offset ?? baseQuery.offset;
      const page = Math.trunc(offset / limit + 1);

      return (
        <Pagination
          isCompact={!isBottom}
          isDisabled={hasNoPriceLists}
          itemCount={count}
          onPerPageSelect={(_event, perPage) => handleOnPerPageSelect(perPage)}
          onSetPage={(_event, pageNumber) => handleOnSetPage(pageNumber)}
          page={page}
          perPage={limit}
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
        <IntegrationContentTable
          costModel={costModel}
          filterBy={query.filter_by}
          isLoading={isLoading}
          onSelect={handleOnSelect}
          providers={providers}
          selectedItems={selectedItems}
        />
      );
    };

    const getToolbar = () => {
      return (
        <IntegrationContentToolbar
          canWrite={canWrite}
          isDisabled={hasNoPriceLists}
          itemsPerPage={providers?.meta?.limit ?? baseQuery.limit}
          itemsTotal={providers?.meta?.count ?? 0}
          onBulkSelect={handleOnBulkSelect}
          onFilterAdded={filter => handleOnFilterAdded(filter)}
          onFilterRemoved={filter => handleOnFilterRemoved(filter)}
          pagination={getPagination()}
          query={query}
          selectedItems={selectedItems}
        />
      );
    };

    // Handlers

    const handleOnAdd = () => {
      onAdd?.(selectedItems ?? []);
    };

    const handleOnBulkSelect = (action: string) => {
      if (action === 'none') {
        setSelectedItems([]);
      } else if (action === 'page') {
        const newSelectedItems = [...selectedItems];
        providers?.data?.map(val => {
          const isAssigned =
            val.cost_models?.length > 0 &&
            val.cost_models?.find(source => source.uuid === costModel.uuid) === undefined;
          if (!newSelectedItems.find(item => item.uuid === val.uuid) && !isAssigned) {
            newSelectedItems.push(val);
          }
        });
        setSelectedItems(newSelectedItems);
      }
    };

    const handleOnFilterAdded = filter => {
      const newQuery = queryUtils.handleOnFilterAdded(query, filter);
      setQuery(newQuery);
    };

    const handleOnFilterRemoved = filter => {
      const newQuery = queryUtils.handleOnFilterRemoved(query, filter);
      setQuery(newQuery);
    };

    const handleOnPerPageSelect = perPage => {
      const newQuery = queryUtils.handleOnPerPageSelect(query, perPage, true);
      setQuery(newQuery);
    };

    const handleOnSelect = (items: Provider[], isSelected: boolean = false) => {
      let newItems = [...selectedItems];
      if (items && items.length > 0) {
        if (isSelected) {
          items.map(item => newItems.push(item));
        } else {
          items.map(item => {
            newItems = newItems.filter(val => val.uuid !== item.uuid);
          });
        }
      }
      setSelectedItems(newItems);
    };

    const handleOnSetPage = pageNumber => {
      const newQuery = queryUtils.handleOnSetPage(query, priceList, pageNumber, true);
      setQuery(newQuery);
    };

    // Effects

    useEffect(() => {
      onDisabled?.(isSaveDisabled);
    }, [isSaveDisabled]);

    useEffect(() => {
      if (costModel) {
        const newSelectedItems = [...(costModel.sources ?? [])];
        setSelectedItems(newSelectedItems);
        setSelectedItemsBaseline(newSelectedItems);
      }
    }, [costModel]);

    useImperativeHandle(
      ref,
      () => ({
        save: () => {
          currentHandlerRef.current();
        },
      }),
      []
    );

    useLayoutEffect(() => {
      currentHandlerRef.current = handleOnAdd;
    });

    if (providersError) {
      return <NotAvailable />;
    }

    return (
      <>
        {!hasNoPriceLists || isLoading ? (
          <>
            <Content component={ContentVariants.dl}>
              <Content component={ContentVariants.dt}>{intl.formatMessage(messages.names, { count: 1 })}</Content>
              <Content component={ContentVariants.dd}>{costModel?.name ?? ''}</Content>
              <Content component={ContentVariants.dt}>{intl.formatMessage(messages.sourceType)}</Content>
              <Content component={ContentVariants.dd}>{costModel?.source_type ?? ''}</Content>
            </Content>
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
          <NoProviders />
        )}
      </>
    );
  }
);

const useMapToProps = ({ costModel, query }: IntegrationContentMapProps): IntegrationContentStateProps => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
  const providerType = costModel?.source_type ? getSourceType(costModel?.source_type) : ProviderType.all;

  const filterBy = Object.fromEntries(
    Object.entries(query?.filter_by ?? baseQuery.filter_by).map(([key, val]) => [key, (val as string[]).join(',')])
  );

  const costModelsQuery = {
    ...filterBy,
    limit: query?.limit,
    offset: query?.offset,
    type: providerType,
  } as Query;

  const providersQueryString = getQuery(costModelsQuery);
  const providers = useSelector((state: RootState) =>
    providersSelectors.selectProviders(state, providerType, providersQueryString)
  );
  const providersError = useSelector((state: RootState) =>
    providersSelectors.selectProvidersError(state, providerType, providersQueryString)
  );
  const providersFetchStatus = useSelector((state: RootState) =>
    providersSelectors.selectProvidersFetchStatus(state, providerType, providersQueryString)
  );

  useEffect(() => {
    if (!providersError && providersFetchStatus !== FetchStatus.inProgress) {
      dispatch(providersActions.fetchProviders(providerType, providersQueryString));
    }
  }, [providersError, providersQueryString, dispatch, query]);

  return {
    providers,
    providersError,
    providersFetchStatus,
  };
};

export { IntegrationContent };

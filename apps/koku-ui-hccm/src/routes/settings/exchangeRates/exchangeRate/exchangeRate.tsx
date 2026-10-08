import { Card, CardBody, Pagination, PaginationVariant } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import { type Settings, SettingsType } from 'api/settings';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { ExportModal } from 'routes/components/export';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import { useSettingsNotifications } from 'routes/settings/utils';
import { getFilterValuesById } from 'routes/settings/utils/filterBy';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { settingsActions, settingsSelectors } from 'store/settings';

import { NoExchangeRateAssignedState, NoExchangeRateState } from './components/state';
import { styles } from './exchangeRate.styles';
import { ExchangeRateTable } from './exchangeRateTable';
import { ExchangeRateToolbar } from './exchangeRateToolbar';

interface ExchangeRateOwnProps {
  canWrite?: boolean;
}

export interface ExchangeRateMapProps {
  isShowDisabled?: boolean;
  query?: Query;
}

export interface ExchangeRateStateProps {
  settings?: Settings;
  settingsError?: AxiosError;
  settingsFetchStatus?: FetchStatus;
  settingsQueryString?: string;
}

type ExchangeRateProps = ExchangeRateOwnProps;

const baseQuery: Query = {
  filter_by: {},
  limit: 10,
  offset: 0,
  order_by: {
    code: 'asc',
  },
};

const ExchangeRate: React.FC<ExchangeRateProps> = ({ canWrite }) => {
  const intl = useIntl();

  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isShowDisabled, setIsShowDisabled] = useState<boolean>(false);
  const [query, setQuery] = useState({ ...baseQuery });

  const { settings, settingsError, settingsFetchStatus, settingsQueryString } = useMapToProps({
    isShowDisabled,
    query,
  });

  const hasFilters = Object.keys(query?.filter_by ?? {}).some(key => query.filter_by[key]?.length > 0);
  const hasNoCurrency = (!settings || settings?.data?.length === 0) && !hasFilters;
  const isLoading = settingsFetchStatus === FetchStatus.inProgress;

  // Force update
  const forceUpdate = useCallback(() => {
    setQuery(prev => ({ ...prev }));
  }, []);

  const getCardLayout = children => (
    <Card>
      <CardBody>
        {intl.formatMessage(messages.exchangeRateDesc)}
        <div style={styles.tableContainer}>
          {getToolbar()}
          {children}
        </div>
      </CardBody>
    </Card>
  );

  const getExportModal = () => {
    return (
      <ExportModal
        count={settings?.meta?.count ?? 0}
        exportPathsType={SettingsType.currency}
        exportQueryString={settingsQueryString}
        exportType={SettingsType.currency}
        groupBy="currency"
        isAllItems={true}
        isOpen={isExportModalOpen}
        onClose={handleOnExportModalClose}
        showAggregateType={false}
        showFormatType={false}
      />
    );
  };

  const getPagination = (isBottom = false) => {
    const count = settings?.meta?.count ?? 0;
    const limit = settings?.meta?.limit ?? baseQuery.limit;
    const offset = settings?.meta?.offset ?? baseQuery.offset;
    const page = Math.trunc(offset / limit + 1);

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={hasNoCurrency}
        itemCount={count}
        onPerPageSelect={(_event, perPage) => handleOnPerPageSelect(perPage)}
        onSetPage={(_event, pageNumber) => handleOnSetPage(pageNumber)}
        page={page}
        perPage={limit}
        titles={{
          paginationAriaLabel: intl.formatMessage(messages.paginationTitle, {
            title: intl.formatMessage(messages.exchangeRate, { count: 1 }),
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
      <ExchangeRateTable
        canWrite={canWrite}
        filterBy={query.filter_by}
        isDisabled={settings?.data?.length === 0}
        isLoading={isLoading}
        onDelete={handleOnDelete}
        onDuplicate={handleOnDuplicate}
        onEdit={handleOnEdit}
        onEnable={handleOnEnable}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        orderBy={query.order_by}
        settings={settings}
      />
    );
  };

  const getToolbar = () => {
    return (
      <ExchangeRateToolbar
        canWrite={canWrite}
        isDisabled={hasNoCurrency}
        isExportDisabled={settings?.meta?.count === 0}
        isShowDisabled={isShowDisabled}
        itemsPerPage={settings?.meta?.limit ?? baseQuery.limit}
        itemsTotal={settings?.meta?.count ?? 0}
        onAdd={handleOnAdd}
        onExportClicked={handleOnExportModalOpen}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        onShowDeprecated={handleOnShowDeprecated}
        pagination={getPagination()}
        query={query}
        settings={settings?.data}
      />
    );
  };

  // Handlers

  const handleOnAdd = () => {
    handleOnSetPage(1);
    forceUpdate();
  };

  // Disabled currencies are removed from the paginated list of items, unless show disabled toggle is active
  // When enabled, Currencies may appear in a different paginated order
  const handleOnEnable = () => {
    handleOnSetPage(1);
    forceUpdate();
  };

  const handleOnDelete = () => {
    handleOnSetPage(1);
    forceUpdate();
  };

  const handleOnDuplicate = () => {
    handleOnSetPage(1);
    forceUpdate();
  };

  const handleOnEdit = () => {
    forceUpdate();
  };

  const handleOnExportModalClose = (isOpen: boolean) => {
    setIsExportModalOpen(isOpen);
  };

  const handleOnExportModalOpen = () => {
    setIsExportModalOpen(true);
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

  const handleOnSetPage = pageNumber => {
    const newQuery = queryUtils.handleOnSetPage(query, settings, pageNumber, true);
    setQuery(newQuery);
  };

  const handleOnShowDeprecated = (checked: boolean) => {
    handleOnSetPage(1);
    setIsShowDisabled(checked);
  };

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  if (settingsError) {
    return <NotAvailable />;
  }

  return (
    <>
      {!hasNoCurrency || isLoading ? (
        getCardLayout(
          <>
            {isLoading ? (
              <LoadingState
                body={intl.formatMessage(messages.exchangeRateLoadingStateDesc)}
                heading={intl.formatMessage(messages.exchangeRateLoadingStateTitle)}
              />
            ) : (
              <>
                {getExportModal()}
                {getTable()}
                <div style={styles.paginationContainer}>{getPagination(true)}</div>
              </>
            )}
          </>
        )
      ) : (
        <>
          {isShowDisabled ? (
            <Card>
              <CardBody>
                <NoExchangeRateAssignedState />
              </CardBody>
            </Card>
          ) : (
            getCardLayout(<NoExchangeRateState />)
          )}
        </>
      )}
    </>
  );
};

const useMapToProps = ({ isShowDisabled, query }: ExchangeRateMapProps): ExchangeRateStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const filterByCurrency = getFilterValuesById(query, 'currency') || getFilterValuesById(baseQuery, 'currency');

  const settingsQuery = {
    filter: {
      ...(filterByCurrency && { currency: filterByCurrency }), // Flattened currency filter
      enabled: isShowDisabled ? undefined : true, // Show enabled by default
    },
    limit: query.limit,
    offset: query.offset,
    order_by: query.order_by,
  };
  const settingsQueryString = getQuery(settingsQuery);
  const settings = useSelector((state: RootState) =>
    settingsSelectors.selectSettings(state, SettingsType.currency, settingsQueryString)
  );
  const settingsError = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsError(state, SettingsType.currency, settingsQueryString)
  );
  const settingsFetchStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsFetchStatus(state, SettingsType.currency, settingsQueryString)
  );

  useEffect(() => {
    if (settingsFetchStatus !== FetchStatus.inProgress) {
      dispatch(settingsActions.fetchSettings(SettingsType.currency, settingsQueryString));
    }
  }, [dispatch, query, settingsQueryString]);

  // Notifications
  useSettingsNotifications({
    type: SettingsType.currencyAdd,
  });
  useSettingsNotifications({
    type: SettingsType.currencyDelete,
  });
  useSettingsNotifications({
    type: SettingsType.currencyDisable,
  });
  useSettingsNotifications({
    type: SettingsType.currencyEdit,
  });
  useSettingsNotifications({
    type: SettingsType.currencyEnable,
  });

  return {
    settings,
    settingsError,
    settingsFetchStatus,
    settingsQueryString,
  };
};

export { ExchangeRate };

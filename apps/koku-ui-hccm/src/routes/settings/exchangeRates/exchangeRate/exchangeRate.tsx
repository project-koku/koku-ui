import { Card, CardBody, Pagination, PaginationVariant } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import { type Settings, SettingsType } from 'api/settings';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
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
}

type ExchangeRateProps = ExchangeRateOwnProps;

const baseQuery: Query = {
  limit: 10,
  offset: 0,
  filter_by: {},
};

const ExchangeRate: React.FC<ExchangeRateProps> = ({ canWrite }) => {
  const intl = useIntl();

  const [isShowDisabled, setIsShowDisabled] = useState<boolean>(false);
  const [query, setQuery] = useState({ ...baseQuery });

  const { settings, settingsError, settingsFetchStatus } = useMapToProps({ isShowDisabled, query });

  const hasFilters = Object.keys(query?.filter_by ?? {}).some(key => query.filter_by[key]?.length > 0);
  const hasNoCurrency = (!settings || settings?.data?.length === 0) && !hasFilters;

  // Force update
  // const forceUpdate = useCallback(() => {
  //   setQuery(prev => ({ ...prev }));
  // }, []);

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
        isLoading={settingsFetchStatus === FetchStatus.inProgress}
        // onDelete={handleOnDelete}
        // onDeprecate={forceUpdate}
        // onDuplicate={forceUpdate}
        settings={settings}
      />
    );
  };

  const getToolbar = () => {
    return (
      <ExchangeRateToolbar
        canWrite={canWrite}
        isDisabled={hasNoCurrency}
        isShowDisabled={isShowDisabled}
        itemsPerPage={settings?.meta?.limit ?? baseQuery.limit}
        itemsTotal={settings?.meta?.count ?? 0}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        onShowDeprecated={handleOnShowDeprecated}
        pagination={getPagination()}
        query={query}
      />
    );
  };

  // Handlers

  // const handleOnDelete = () => {
  //   handleOnSetPage(1);
  //   forceUpdate();
  // };

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
    setIsShowDisabled(checked);
  };

  if (settingsError) {
    return <NotAvailable />;
  }

  return (
    <>
      {!hasNoCurrency || settingsFetchStatus === FetchStatus.inProgress ? (
        getCardLayout(
          <>
            {settingsFetchStatus === FetchStatus.inProgress ? (
              <LoadingState
                body={intl.formatMessage(messages.exchangeRateLoadingStateDesc)}
                heading={intl.formatMessage(messages.exchangeRateLoadingStateTitle)}
              />
            ) : (
              <>
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
    // ...(isShowDisabled && { enabled: false }),
    enabled: isShowDisabled ? undefined : true, // Show enabled by default
    limit: query.limit,
    offset: query.offset,
    ...(filterByCurrency && { search: filterByCurrency }), // Flattened currency filter
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
  }, [dispatch, settingsQueryString, query]);

  // Notifications
  useSettingsNotifications({
    type: SettingsType.currency,
  });

  return {
    settings,
    settingsError,
    settingsFetchStatus,
  };
};

export { ExchangeRate };

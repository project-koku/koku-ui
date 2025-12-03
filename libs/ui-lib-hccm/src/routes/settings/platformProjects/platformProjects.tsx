import type { Query } from '@koku-ui/api/queries/query';
import { getQuery } from '@koku-ui/api/queries/query';
import type { Settings } from '@koku-ui/api/settings';
import type { SettingsData } from '@koku-ui/api/settings';
import { SettingsType } from '@koku-ui/api/settings';
import messages from '@koku-ui/i18n/locales/messages';
import { Card, CardBody, Pagination, PaginationVariant } from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';

import type { RootState } from '../../../store';
import { FetchStatus } from '../../../store/common';
import { settingsActions, settingsSelectors } from '../../../store/settings';
import { useStateCallback } from '../../../utils/hooks';
import { NotAvailable } from '../../components/page/notAvailable';
import { LoadingState } from '../../components/state/loadingState';
import * as queryUtils from '../../utils/query';
import { useSettingsUpdate } from '../utils/hooks';
import { styles } from './platformProjects.styles';
import { PlatformProjectsTable } from './platformProjectsTable';
import { GroupType, PlatformProjectsToolbar } from './platformProjectsToolbar';

interface PlatformProjectsOwnProps {
  canWrite?: boolean;
}

export interface PlatformProjectsMapProps {
  query?: Query;
}

export interface PlatformProjectsStateProps {
  settings?: Settings;
  settingsError?: AxiosError;
  settingsStatus?: FetchStatus;
  settingsQueryString?: string;
}

type PlatformProjectsProps = PlatformProjectsOwnProps;

const baseQuery: Query = {
  limit: 10,
  offset: 0,
  filter_by: {},
  order_by: {
    group: 'asc',
  },
};

const PlatformProjects: React.FC<PlatformProjectsProps> = ({ canWrite }) => {
  const [query, setQuery] = useState({ ...baseQuery });
  const [selectedItems, setSelectedItems] = useStateCallback([]);
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const { settings, settingsError, settingsStatus } = useMapToProps({ query });

  const getCategories = () => {
    if (settings) {
      return settings.data as any;
    }
    return [];
  };

  const getPagination = (isDisabled = false, isBottom = false) => {
    const count = settings?.meta ? settings.meta.count : 0;
    const limit = settings?.meta ? settings.meta.limit : baseQuery.limit;
    const offset = settings?.meta ? settings.meta.offset : baseQuery.offset;
    const page = Math.trunc(offset / limit + 1);

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={isDisabled}
        itemCount={count}
        onPerPageSelect={(event, perPage) => handleOnPerPageSelect(perPage)}
        onSetPage={(event, pageNumber) => handleOnSetPage(pageNumber)}
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
      <PlatformProjectsTable
        canWrite={canWrite}
        filterBy={query.filter_by}
        isLoading={settingsStatus === FetchStatus.inProgress}
        orderBy={query.order_by}
        onSelect={handleonSelect}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        settings={settings}
        selectedItems={selectedItems}
      />
    );
  };

  const getToolbar = (categories: SettingsData[]) => {
    const hasEnabledPlatformGroup = selectedItems.find(item => item.group === 'Platform' && !item.default);
    const hasDisabledPlatformGroup = selectedItems.find(item => item.group !== 'Platform' && !item.default);
    const itemsTotal = settings?.meta ? settings.meta.count : 0;
    const unAvailableCategories = categories.filter(item => item.default);

    return (
      <PlatformProjectsToolbar
        canWrite={canWrite}
        isDisabled={categories.length === 0}
        isPrimaryActionDisabled={!hasDisabledPlatformGroup}
        isSecondaryActionDisabled={!hasEnabledPlatformGroup}
        itemsPerPage={categories.length - unAvailableCategories.length}
        itemsTotal={itemsTotal}
        onAdd={handleOnAdd}
        onBulkSelect={handleOnBulkSelect}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        onRemove={handleOnRemove}
        pagination={getPagination(isDisabled)}
        query={query}
        selectedItems={selectedItems}
        showBulkSelectAll={false}
      />
    );
  };

  const handleOnBulkSelect = (action: string) => {
    if (action === 'none') {
      setSelectedItems([]);
    } else if (action === 'page') {
      const newSelectedItems = [...selectedItems];
      getCategories().map(val => {
        if (!newSelectedItems.find(item => item.project === val.project) && !val.default) {
          newSelectedItems.push(val);
        }
      });
      setSelectedItems(newSelectedItems);
    }
  };

  const handleOnAdd = () => {
    if (selectedItems.length > 0) {
      const payload = selectedItems.map(item => ({
        project: item.project,
        group: GroupType.platform,
      }));
      setSelectedItems([], () => {
        dispatch(settingsActions.updateSettings(SettingsType.platformProjectsAdd, payload as any));
      });
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

  const handleOnRemove = () => {
    if (selectedItems.length > 0) {
      const payload = selectedItems.map(item => {
        if (!item.default) {
          return {
            project: item.project,
            group: item.group,
          };
        }
      });
      setSelectedItems([], () => {
        dispatch(settingsActions.updateSettings(SettingsType.platformProjectsRemove, payload as any));
      });
    }
  };

  const handleOnSetPage = pageNumber => {
    const newQuery = queryUtils.handleOnSetPage(query, settings, pageNumber, true);
    setQuery(newQuery);
  };

  const handleonSelect = (items: SettingsData[], isSelected: boolean = false) => {
    let newItems = [...selectedItems];
    if (items && items.length > 0) {
      if (isSelected) {
        items.map(item => newItems.push(item));
      } else {
        items.map(item => {
          newItems = newItems.filter(val => val.project !== item.project);
        });
      }
    }
    setSelectedItems(newItems);
  };

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  const categories = getCategories();
  const isDisabled = categories.length === 0;

  if (settingsError) {
    return <NotAvailable />;
  }
  return (
    <Card>
      <CardBody>
        {intl.formatMessage(messages.platformProjectsDesc, {
          learnMore: (
            <a href={intl.formatMessage(messages.docsPlatformProjects)} rel="noreferrer" target="_blank">
              {intl.formatMessage(messages.learnMore)}
            </a>
          ),
        })}
        <div style={styles.tableContainer}>
          {getToolbar(categories)}
          {settingsStatus === FetchStatus.inProgress ? (
            <LoadingState />
          ) : (
            <>
              {getTable()}
              <div style={styles.paginationContainer}>{getPagination(isDisabled, true)}</div>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

const useMapToProps = ({ query }: PlatformProjectsMapProps): PlatformProjectsStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const settingsQuery = {
    filter_by: query.filter_by,
    limit: query.limit,
    offset: query.offset,
    order_by: query.order_by,
  };
  const settingsQueryString = getQuery(settingsQuery);
  const settings = useSelector((state: RootState) =>
    settingsSelectors.selectSettings(state, SettingsType.platformProjects, settingsQueryString)
  );
  const settingsStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsStatus(state, SettingsType.platformProjects, settingsQueryString)
  );
  const settingsError = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsError(state, SettingsType.platformProjects, settingsQueryString)
  );

  const { status: settingsUpdateDisableStatus } = useSettingsUpdate({
    type: SettingsType.platformProjectsAdd,
  });

  const { status: settingsUpdateEnableStatus } = useSettingsUpdate({
    type: SettingsType.platformProjectsRemove,
  });

  useEffect(() => {
    if (
      !settingsError &&
      settingsStatus !== FetchStatus.inProgress &&
      settingsUpdateDisableStatus !== FetchStatus.inProgress &&
      settingsUpdateEnableStatus !== FetchStatus.inProgress
    ) {
      dispatch(settingsActions.fetchSettings(SettingsType.platformProjects, settingsQueryString));
    }
  }, [query, settingsUpdateDisableStatus, settingsUpdateEnableStatus]);

  return {
    settings,
    settingsError,
    settingsStatus,
    settingsQueryString,
  };
};

export default PlatformProjects;

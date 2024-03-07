import Unavailable from '@patternfly/react-component-groups/dist/esm/UnavailableContent';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { Settings, SettingsData } from 'api/settings';
import { SettingsType } from 'api/settings';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { LoadingState } from 'routes/components/state/loadingState';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { settingsActions, settingsSelectors } from 'store/settings';
import { useStateCallback } from 'utils/hooks';

import { styles } from './tags.styles';
import { TagsTable } from './tagsTable';
import { TagsToolbar } from './tagsToolbar';

interface TagsOwnProps {
  canWrite?: boolean;
}

export interface TagsMapProps {
  query?: Query;
}

export interface TagsStateProps {
  settings?: Settings;
  settingsError?: AxiosError;
  settingsStatus?: FetchStatus;
  settingsQueryString?: string;
}

type TagsProps = TagsOwnProps;

const baseQuery: Query = {
  limit: 10,
  offset: 0,
  filter_by: {},
  order_by: {
    key: 'asc',
  },
};

const Tags: React.FC<TagsProps> = ({ canWrite }) => {
  const [query, setQuery] = useState({ ...baseQuery });
  const [selectedItems, setSelectedItems] = useStateCallback([]);
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const { settings, settingsError, settingsStatus } = useMapToProps({ query });

  const getTags = () => {
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
        widgetId={`exports-pagination${isBottom ? '-bottom' : ''}`}
      />
    );
  };

  const getTable = () => {
    return (
      <TagsTable
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

  const getToolbar = (tags: SettingsData[]) => {
    const hasEnabledItem = selectedItems.find(item => item.enabled);
    const hasDisabledItem = selectedItems.find(item => !item.enabled);
    const itemsTotal = settings?.meta ? settings.meta.count : 0;
    const enabledTagsCount = settings?.meta ? settings.meta.enabled_tags_count : 0;
    const enabledTagsLimit = settings?.meta ? settings.meta.enabled_tags_limit : 0;

    return (
      <TagsToolbar
        canWrite={canWrite}
        enabledTagsCount={enabledTagsCount}
        enabledTagsLimit={enabledTagsLimit}
        isDisabled={tags.length === 0}
        isPrimaryActionDisabled={!hasDisabledItem}
        isSecondaryActionDisabled={!hasEnabledItem}
        itemsPerPage={tags.length}
        itemsTotal={itemsTotal}
        onBulkSelect={handleOnBulkSelect}
        onDisableTags={handleOnDisableTags}
        onEnableTags={handleOnEnableTags}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
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
      getTags().map(val => {
        if (!newSelectedItems.find(item => item.uuid === val.uuid)) {
          newSelectedItems.push(val);
        }
      });
      setSelectedItems(newSelectedItems);
    }
  };

  const handleOnDisableTags = () => {
    if (selectedItems.length > 0) {
      setSelectedItems([], () => {
        dispatch(
          settingsActions.updateSettings(SettingsType.tagsDisable, {
            ids: selectedItems.map(item => item.uuid),
          })
        );
      });
    }
  };

  const handleOnEnableTags = () => {
    if (selectedItems.length > 0) {
      setSelectedItems([], () => {
        dispatch(
          settingsActions.updateSettings(SettingsType.tagsEnable, {
            ids: selectedItems.map(item => item.uuid),
          })
        );
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
          newItems = newItems.filter(val => val.uuid !== item.uuid);
        });
      }
    }
    setSelectedItems(newItems);
  };

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  if (settingsError) {
    return <Unavailable />;
  }

  const tags = getTags();
  const isDisabled = tags.length === 0;
  const enabledTagsLimit = settings?.meta ? settings.meta.enabled_tags_limit : 0;

  return (
    <>
      <div>
        {intl.formatMessage(messages.tagDesc, {
          count: enabledTagsLimit,
          learnMore: (
            <a href={intl.formatMessage(messages.docsTags)} rel="noreferrer" target="_blank">
              {intl.formatMessage(messages.learnMore)}
            </a>
          ),
        })}
      </div>
      {getToolbar(tags)}
      {settingsStatus === FetchStatus.inProgress ? (
        <LoadingState />
      ) : (
        <>
          {getTable()}
          <div style={styles.pagination}>{getPagination(isDisabled, true)}</div>
        </>
      )}
    </>
  );
};

// eslint-disable-next-line no-empty-pattern
const useMapToProps = ({ query }: TagsMapProps): TagsStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const settingsQuery = {
    filter_by: query.filter_by,
    limit: query.limit,
    offset: query.offset,
    order_by: query.order_by,
  };
  const settingsQueryString = getQuery(settingsQuery);
  const settings = useSelector((state: RootState) =>
    settingsSelectors.selectSettings(state, SettingsType.tags, settingsQueryString)
  );
  const settingsStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsStatus(state, SettingsType.tags, settingsQueryString)
  );
  const settingsError = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsError(state, SettingsType.tags, settingsQueryString)
  );

  const settingsUpdateDisableStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsUpdateStatus(state, SettingsType.tagsDisable)
  );
  const settingsUpdateEnableStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsUpdateStatus(state, SettingsType.tagsEnable)
  );

  useEffect(() => {
    if (
      !settingsError &&
      settingsStatus !== FetchStatus.inProgress &&
      settingsUpdateDisableStatus !== FetchStatus.inProgress &&
      settingsUpdateEnableStatus !== FetchStatus.inProgress
    ) {
      dispatch(settingsActions.fetchSettings(SettingsType.tags, settingsQueryString));
    }
  }, [query, settingsUpdateDisableStatus, settingsUpdateEnableStatus]);

  return {
    settings,
    settingsError,
    settingsStatus,
    settingsQueryString,
  };
};

export default Tags;

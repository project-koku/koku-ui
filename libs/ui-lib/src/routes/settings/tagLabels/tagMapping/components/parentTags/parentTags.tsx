import type { Query } from '@koku-ui/api/queries/query';
import { getQuery } from '@koku-ui/api/queries/query';
import type { Settings, SettingsData } from '@koku-ui/api/settings';
import { SettingsType } from '@koku-ui/api/settings';
import messages from '@koku-ui/i18n/locales/messages';
import Unavailable from '@patternfly/react-component-groups/dist/esm/UnavailableContent';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';

import type { RootState } from '../../../../../../store';
import { FetchStatus } from '../../../../../../store/common';
import { settingsActions, settingsSelectors } from '../../../../../../store/settings';
import { LoadingState } from '../../../../../components/state/loadingState';
import * as queryUtils from '../../../../../utils/query';
import { ParentTagsTable } from './parentTagsTable';
import { styles } from './parentTagsTable.styles';
import { ParentTagsToolbar } from './parentTagsToolbar';

interface ParentTagsOwnProps {
  onBulkSelect(items: SettingsData[]);
  onSelect(items: SettingsData[], isSelected: boolean);
  selectedItems?: SettingsData[];
  unavailableItems?: SettingsData[];
}

interface ParentTagsMapProps {
  query?: Query;
}

interface ParentTagsStateProps {
  settings?: Settings;
  settingsError?: AxiosError;
  settingsStatus?: FetchStatus;
  settingsQueryString?: string;
}

type ParentTagsProps = ParentTagsOwnProps;

const baseQuery: Query = {
  limit: 10,
  offset: 0,
  filter_by: {},
  order_by: {
    key: 'asc',
  },
};

const ParentTags: React.FC<ParentTagsProps> = ({
  onBulkSelect,
  onSelect,
  selectedItems,
  unavailableItems,
}: ParentTagsProps) => {
  const [query, setQuery] = useState({ ...baseQuery });
  const { settings, settingsError, settingsStatus } = useMapToProps({ query });

  const intl = useIntl();

  const getMappings = () => {
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
      <ParentTagsTable
        filterBy={query.filter_by}
        isLoading={settingsStatus === FetchStatus.inProgress}
        orderBy={query.order_by}
        onSelect={onSelect}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        selectedItems={selectedItems}
        settings={settings}
        unavailableItems={unavailableItems}
      />
    );
  };

  const getToolbar = (mappings: SettingsData[]) => {
    const itemsTotal = settings?.meta ? settings.meta.count : 0;

    return (
      <ParentTagsToolbar
        isDisabled={mappings.length === 0}
        itemsPerPage={mappings.length}
        itemsTotal={itemsTotal}
        onBulkSelect={handleOnBulkSelect}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        pagination={getPagination(isDisabled)}
        selectedItems={selectedItems}
        query={query}
      />
    );
  };

  const handleOnBulkSelect = (action: string) => {
    if (action === 'none') {
      onBulkSelect([]);
    } else if (action === 'page') {
      const newSelectedItems = [...selectedItems];
      getMappings().map(val => {
        if (!newSelectedItems.find(item => item.uuid === val.uuid)) {
          newSelectedItems.push(val);
        }
      });
      onBulkSelect(newSelectedItems);
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

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  if (settingsError) {
    return <Unavailable />;
  }

  const mappings = getMappings();
  const isDisabled = mappings.length === 0;

  return (
    <>
      {getToolbar(mappings)}
      {settingsStatus === FetchStatus.inProgress ? (
        <div style={styles.loading}>
          <LoadingState />
        </div>
      ) : (
        <>
          {getTable()}
          <div style={styles.pagination}>{getPagination(isDisabled, true)}</div>
        </>
      )}
    </>
  );
};

const useMapToProps = ({ query }: ParentTagsMapProps): ParentTagsStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const settingsQuery = {
    filter_by: query.filter_by,
    limit: query.limit,
    offset: query.offset,
    order_by: query.order_by,
  };
  const settingsQueryString = getQuery(settingsQuery);
  const settings = useSelector((state: RootState) =>
    settingsSelectors.selectSettings(state, SettingsType.tagsMappingsParent, settingsQueryString)
  );
  const settingsStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsStatus(state, SettingsType.tagsMappingsParent, settingsQueryString)
  );
  const settingsError = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsError(state, SettingsType.tagsMappingsParent, settingsQueryString)
  );

  useEffect(() => {
    if (!settingsError && settingsStatus !== FetchStatus.inProgress) {
      dispatch(settingsActions.fetchSettings(SettingsType.tagsMappingsParent, settingsQueryString));
    }
  }, [query]);

  return {
    settings,
    settingsError,
    settingsStatus,
    settingsQueryString,
  };
};

export default ParentTags;

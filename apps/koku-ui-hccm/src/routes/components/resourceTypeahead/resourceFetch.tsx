import type { ToolbarLabelGroup } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { Resource } from 'api/resources/resource';
import type { ResourcePathsType, ResourceType } from 'api/resources/resource';
import type { AxiosError } from 'axios';
import type { FormEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { noop } from 'routes/utils/noop';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { resourceActions, resourceSelectors } from 'store/resources';

import { ResourceInput } from './resourceInput';

interface ResourceFetchOwnProps {
  ariaLabel?: string;
  isDisabled?: boolean;
  onChange?: (evt: FormEvent, value: string) => void;
  onClear?: () => void;
  onSelect?: (value: string) => void;
  placeholder?: string;
  resourceKey?: string;
  resourcePathsType: ResourcePathsType;
  resourceType: ResourceType;
  search?: string;
}

export interface ResourceFetchMapProps {
  resourcePathsType: ResourcePathsType;
  resourceType: ResourceType;
  search?: string;
}

interface ResourceFetchStateProps {
  resource?: Resource;
  resourceError?: AxiosError;
  resourceFetchStatus?: FetchStatus;
  resourceQueryString?: string;
}

type ResourceFetchProps = ResourceFetchOwnProps;

const ResourceFetch: React.FC<ResourceFetchProps> = ({
  ariaLabel,
  isDisabled,
  onChange,
  onClear,
  onSelect,
  placeholder,
  resourceKey,
  resourcePathsType,
  resourceType,
  search,
}) => {
  const { resource, resourceFetchStatus } = useMapToProps({ resourcePathsType, resourceType, search });

  const getOptions = (): ToolbarLabelGroup[] => {
    let options = [];
    if (resource?.data?.length > 0 && resourceFetchStatus !== FetchStatus.inProgress) {
      // The resource API typically returns just a value, but account_alias, cluster_alias, and instance_name may be preferred keys.
      options = resource.data.map(item => {
        // Show aliases (resourceKey) only for matching search input, show ID (value) by default
        let value = item.value;
        if (item[resourceKey]?.toLowerCase().includes(search?.toLowerCase())) {
          value = item[resourceKey];
        }
        return {
          key: value,
          name: value,
        };
      });
    }
    return options;
  };

  return (
    <ResourceInput
      ariaLabel={ariaLabel}
      isDisabled={isDisabled}
      onChange={onChange}
      onClear={onClear}
      onSelect={onSelect}
      options={getOptions()}
      placeholder={placeholder}
      search={search}
    />
  );
};

const useMapToProps = ({ resourcePathsType, resourceType, search }: ResourceFetchMapProps): ResourceFetchStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const [searchTimeout, setSearchTimeout] = useState(noop);

  const query: Query = {
    search,
  };
  const resourceQueryString = getQuery(query);
  const resource = useSelector((state: RootState) =>
    resourceSelectors.selectResource(state, resourcePathsType, resourceType, resourceQueryString)
  );
  const resourceFetchStatus = useSelector((state: RootState) =>
    resourceSelectors.selectResourceFetchStatus(state, resourcePathsType, resourceType, resourceQueryString)
  );
  const resourceError = useSelector((state: RootState) =>
    resourceSelectors.selectResourceError(state, resourcePathsType, resourceType, resourceQueryString)
  );

  useEffect(() => {
    if (search?.trim().length && !resourceError && resourceFetchStatus !== FetchStatus.inProgress) {
      clearTimeout(searchTimeout);

      // Delay was 750ms, but reduced -- https://issues.redhat.com/browse/COST-1742
      setSearchTimeout(
        setTimeout(() => {
          dispatch(resourceActions.fetchResource(resourcePathsType, resourceType, resourceQueryString));
        }, 625)
      );
    }
  }, [search]);

  return {
    resource,
    resourceFetchStatus,
    resourceQueryString,
  };
};

export { ResourceFetch };

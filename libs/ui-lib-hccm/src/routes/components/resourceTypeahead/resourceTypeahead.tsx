import type { ResourcePathsType, ResourceType } from '@koku-ui/api/resources/resource';
import type { FormEvent } from 'react';
import React, { useState } from 'react';

import { ResourceFetch } from './resourceFetch';

interface ResourceTypeaheadOwnProps {
  ariaLabel?: string;
  isDisabled?: boolean;
  onSelect?: (value: string) => void;
  placeholder?: string;
  resourceKey?: string;
  resourcePathsType: ResourcePathsType;
  resourceType: ResourceType;
}

type ResourceTypeaheadProps = ResourceTypeaheadOwnProps;

// This wrapper provides text input value as the search prop for ResourceInput.
// This is used to create a query param to retrieve cached API requests.
const ResourceTypeahead: React.FC<ResourceTypeaheadProps> = ({
  ariaLabel,
  isDisabled,
  onSelect,
  placeholder,
  resourceKey,
  resourcePathsType,
  resourceType,
}) => {
  const [search, setSearch] = useState<string>();

  const handleOnClear = () => {
    setSearch(undefined);
  };

  const handleOnChange = (evt: FormEvent, value: string) => {
    setSearch(value);
  };

  const handleOnSelect = (value: string) => {
    setSearch(undefined);

    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <ResourceFetch
      ariaLabel={ariaLabel}
      isDisabled={isDisabled}
      onClear={handleOnClear}
      onChange={handleOnChange}
      onSelect={handleOnSelect}
      placeholder={placeholder}
      resourceKey={resourceKey}
      resourcePathsType={resourcePathsType}
      resourceType={resourceType}
      search={search}
    />
  );
};

export default ResourceTypeahead;

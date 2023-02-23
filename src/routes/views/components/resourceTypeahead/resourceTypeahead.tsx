import type { ResourcePathsType, ResourceType } from 'api/resources/resource';
import type { FormEvent } from 'react';
import React from 'react';

import { ResourceInput } from './resourceInput';

interface ResourceTypeaheadOwnProps {
  ariaLabel?: string;
  isDisabled?: boolean;
  onSelect?: (value: string) => void;
  resourcePathsType: ResourcePathsType;
  resourceType: ResourceType;
  placeholder?: string;
}

interface ResourceTypeaheadState {
  search?: string;
}

type ResourceTypeaheadProps = ResourceTypeaheadOwnProps;

// This wrapper provides text input value as the search prop for ResourceInput.
// This is used to create a query param to retrieve cached API requests.
class ResourceTypeahead extends React.Component<ResourceTypeaheadProps> {
  protected defaultState: ResourceTypeaheadState = {
    search: undefined,
  };
  public state: ResourceTypeaheadState = { ...this.defaultState };

  constructor(props: ResourceTypeaheadProps) {
    super(props);

    this.handleOnClear = this.handleOnClear.bind(this);
    this.handleOnSearch = this.handleOnSearch.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
  }

  private handleOnClear = () => {
    this.setState({
      search: undefined,
    });
  };

  private handleOnSearch = (evt: FormEvent, value: string) => {
    this.setState({
      search: value,
    });
  };

  private handleOnSelect = (value: string) => {
    const { onSelect } = this.props;

    this.setState(
      {
        search: undefined,
      },
      () => {
        if (onSelect) {
          onSelect(value);
        }
      }
    );
  };

  public render() {
    const { ariaLabel, isDisabled, placeholder, resourcePathsType, resourceType } = this.props;
    const { search } = this.state;

    return (
      <ResourceInput
        ariaLabel={ariaLabel}
        isDisabled={isDisabled}
        onClear={this.handleOnClear}
        onSearchChanged={this.handleOnSearch}
        onSelect={this.handleOnSelect}
        placeholder={placeholder}
        resourcePathsType={resourcePathsType}
        resourceType={resourceType}
        search={search}
      />
    );
  }
}

export default ResourceTypeahead;

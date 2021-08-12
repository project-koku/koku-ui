import { ResourcePathsType, ResourceType } from 'api/resources/resource';
import React from 'react';
import { noop } from 'utils/noop';

import { ResourceSelect } from './resourceSelect';

interface ResourceTypeaheadOwnProps {
  isDisabled?: boolean;
  onSelect?: (value: string) => void;
  resourcePathsType: ResourcePathsType;
  resourceType: ResourceType;
}

interface ResourceTypeaheadState {
  currentSearch?: string;
}

type ResourceTypeaheadProps = ResourceTypeaheadOwnProps;

export class ResourceTypeahead extends React.Component<ResourceTypeaheadProps> {
  private searchTimeout: any = noop;

  protected defaultState: ResourceTypeaheadState = {
    // TBD ...
  };
  public state: ResourceTypeaheadState = { ...this.defaultState };

  constructor(props: ResourceTypeaheadProps) {
    super(props);

    this.handleOnSearch = this.handleOnSearch.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
  }

  private handleOnSearch = (value: string) => {
    clearTimeout(this.searchTimeout);

    // Delay was 750ms, but reduced -- https://issues.redhat.com/browse/COST-1742
    this.searchTimeout = setTimeout(() => {
      this.setState({
        currentSearch: value,
      });
    }, 625);
  };

  private handleOnSelect = (value: string) => {
    const { onSelect } = this.props;

    if (onSelect) {
      onSelect(value);
    }
    this.setState({
      currentSearch: undefined,
    });
  };

  public render() {
    const { isDisabled, resourcePathsType, resourceType } = this.props;
    const { currentSearch } = this.state;

    return (
      <ResourceSelect
        isDisabled={isDisabled}
        onSearchChanged={this.handleOnSearch}
        onSelect={this.handleOnSelect}
        resourcePathsType={resourcePathsType}
        resourceType={resourceType}
        search={currentSearch}
      />
    );
  }
}

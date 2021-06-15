import { ResourcePathsType, ResourceType } from 'api/resources/resource';
import React from 'react';
import { noop } from 'utils/noop';

import { ResourceSelect } from './resourceSelect';

interface ResourceOwnProps {
  isDisabled?: boolean;
  onSelect?: (value: string) => void;
  resourcePathsType: ResourcePathsType;
  resourceType: ResourceType;
}

interface ResourceState {
  currentSearch?: string;
}

type ResourceProps = ResourceOwnProps;

export class Resource extends React.Component<ResourceProps> {
  private searchTimeout: any = noop;

  protected defaultState: ResourceState = {
    // TBD ...
  };
  public state: ResourceState = { ...this.defaultState };

  constructor(props: ResourceProps) {
    super(props);

    this.handldeOnSearch = this.handldeOnSearch.bind(this);
    this.handldeOnSelect = this.handldeOnSelect.bind(this);
  }

  private handldeOnSearch = (value: string) => {
    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.setState({
        currentSearch: value,
      });
    }, 750);
  };

  private handldeOnSelect = (value: string) => {
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
        onSearchChanged={this.handldeOnSearch}
        onSelect={this.handldeOnSelect}
        resourcePathsType={resourcePathsType}
        resourceType={resourceType}
        search={currentSearch}
      />
    );
  }
}

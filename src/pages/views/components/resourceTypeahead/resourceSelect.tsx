import { Select, SelectOption, SelectVariant, ToolbarChipGroup } from '@patternfly/react-core';
import { getQuery, Query } from 'api/queries/query';
import { Resource, ResourcePathsType, ResourceType } from 'api/resources/resource';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { resourceActions, resourceSelectors } from 'store/resources';

interface ResourceSelectOwnProps {
  isDisabled?: boolean;
  onSearchChanged?: (value: string) => void;
  onSelect?: (value: string) => void;
  resource?: Resource;
  resourcePathsType: ResourcePathsType;
  resourceType: ResourceType;
  search?: string;
}

interface ResourceSelectStateProps {
  resourceFetchStatus?: FetchStatus;
}

interface ResourceSelectState {
  isSelectExpanded?: boolean;
}

interface ResourceSelectDispatchProps {
  fetchResource?: typeof resourceActions.fetchResource;
}

type ResourceSelectProps = ResourceSelectOwnProps &
  ResourceSelectStateProps &
  ResourceSelectDispatchProps &
  WithTranslation;

class ResourceSelectBase extends React.Component<ResourceSelectProps> {
  protected defaultState: ResourceSelectState = {
    isSelectExpanded: false,
  };
  public state: ResourceSelectState = { ...this.defaultState };

  constructor(props: ResourceSelectProps) {
    super(props);

    this.handldeOnClear = this.handldeOnClear.bind(this);
    this.handldeOnSelect = this.handldeOnSelect.bind(this);
    this.handldeOnToggle = this.handldeOnToggle.bind(this);
    this.handleOnTypeaheadInputChanged = this.handleOnTypeaheadInputChanged.bind(this);
  }

  public componentDidUpdate(prevProps: ResourceSelectProps) {
    const { fetchResource, resourceFetchStatus, resourcePathsType, resourceType, search } = this.props;

    if (search && prevProps.search !== search && resourceFetchStatus !== FetchStatus.inProgress) {
      const query: Query = {
        search,
      };
      const queryString = getQuery(query);
      fetchResource(resourcePathsType, resourceType, queryString);
    }
  }

  private getOptions = (): ToolbarChipGroup[] => {
    const { resource, resourceFetchStatus } = this.props;
    let options = [];

    if (resource && resource.data && resource.data.length > 0 && resourceFetchStatus !== FetchStatus.inProgress) {
      options = resource.data.map(item => {
        const value = item.account_alias || item.value;
        return {
          key: value,
          name: value,
        };
      });
    }
    return options;
  };

  private getSelectOptions = () => {
    const options = this.getOptions();

    return options.map(option => {
      return <SelectOption key={option.key} value={option.key} />;
    });
  };

  private handldeOnClear = () => {
    const { onSearchChanged } = this.props;

    if (onSearchChanged) {
      onSearchChanged(undefined);
    }
    this.setState({
      isSelectExpanded: false,
    });
  };

  private handldeOnSelect = (event, value) => {
    const { onSelect } = this.props;

    if (onSelect) {
      onSelect(value);
    }
    this.setState({
      isSelectExpanded: !this.state.isSelectExpanded,
    });
  };

  private handldeOnToggle = isOpen => {
    this.setState({
      isSelectExpanded: isOpen,
    });
  };

  private handleOnTypeaheadInputChanged = value => {
    const { onSearchChanged } = this.props;
    onSearchChanged(value);
  };

  public render() {
    const { isDisabled, t, resourceType } = this.props;
    const { isSelectExpanded } = this.state;

    const selectOptions = this.getSelectOptions();

    return (
      <Select
        isDisabled={isDisabled}
        isOpen={isSelectExpanded}
        onClear={this.handldeOnClear}
        onFilter={() => selectOptions}
        onSelect={this.handldeOnSelect}
        onToggle={this.handldeOnToggle}
        onTypeaheadInputChanged={this.handleOnTypeaheadInputChanged}
        placeholderText={t(`filter_by.${resourceType}.placeholder`)}
        typeAheadAriaLabel={t(`filter_by.${resourceType}.aria_label`)}
        variant={SelectVariant.typeahead}
      >
        {selectOptions}
      </Select>
    );
  }
}

const mapStateToProps = createMapStateToProps<ResourceSelectOwnProps, ResourceSelectStateProps>(
  (state, { resourcePathsType, resourceType, search }) => {
    const query: Query = {
      search,
    };
    const queryString = getQuery(query);

    const resource = resourceSelectors.selectResource(state, resourcePathsType, resourceType, queryString);
    const resourceFetchStatus = resourceSelectors.selectResourceFetchStatus(
      state,
      resourcePathsType,
      resourceType,
      queryString
    );

    return {
      resource,
      resourceFetchStatus,
    };
  }
);

const mapDispatchToProps: ResourceSelectDispatchProps = {
  fetchResource: resourceActions.fetchResource,
};

const ResourceSelect = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ResourceSelectBase));

export { ResourceSelect };

import { Select, SelectOption, SelectVariant, ToolbarChipGroup } from '@patternfly/react-core';
import { getQuery, Query } from 'api/queries/query';
import { Resource, ResourcePathsType, ResourceType } from 'api/resources/resource';
import { createIntlEnv } from 'components/i18n/localeEnv';
import messages from 'locales/messages';
import React from 'react';
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
  createdOptions: any[];
  isSelectExpanded?: boolean;
}

interface ResourceSelectDispatchProps {
  fetchResource?: typeof resourceActions.fetchResource;
}

type ResourceSelectProps = ResourceSelectOwnProps & ResourceSelectStateProps & ResourceSelectDispatchProps;

class ResourceSelectBase extends React.Component<ResourceSelectProps> {
  protected defaultState: ResourceSelectState = {
    createdOptions: [],
    isSelectExpanded: false,
  };
  public state: ResourceSelectState = { ...this.defaultState };

  constructor(props: ResourceSelectProps) {
    super(props);

    this.handleOnClear = this.handleOnClear.bind(this);
    this.handleOnCreateOption = this.handleOnCreateOption.bind(this);
    this.handleOnFilter = this.handleOnFilter.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnToggle = this.handleOnToggle.bind(this);
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
    const { resource, resourceFetchStatus, search } = this.props;
    const { createdOptions } = this.state;
    let options = [];
    if (resource && resource.data && resource.data.length > 0 && resourceFetchStatus !== FetchStatus.inProgress) {
      options = resource.data.map(item => {
        const value = !isNaN(search as any) ? item.value : item.account_alias || item.cluster_alias || item.value;
        return {
          key: value,
          name: value,
        };
      });
    }
    if (createdOptions && createdOptions.length) {
      const moreOptions = createdOptions.map(val => {
        return {
          key: val,
          name: val,
        };
      });
      options = [...options, ...moreOptions];
    }
    return options;
  };

  private getSelectOptions = () => {
    const options = this.getOptions();

    return options.map(option => {
      return <SelectOption key={option.key} value={option.key} />;
    });
  };

  private handleOnCreateOption = value => {
    const { createdOptions } = this.state;

    if (value.trim() === '') {
      return;
    }
    let options = [...createdOptions];
    if (options.length > 4) {
      options = options.slice(1, options.length);
    }
    options.push(value);

    this.setState({
      createdOptions: options,
    });
  };

  private handleOnClear = () => {
    const { onSearchChanged } = this.props;

    if (onSearchChanged) {
      onSearchChanged(undefined);
    }
    this.setState({
      isSelectExpanded: false,
    });
  };

  private handleOnFilter = event => {
    if (event === null) {
      return null;
    }
    return this.getSelectOptions();
  };

  private handleOnSelect = (event, value) => {
    const { onSelect } = this.props;

    if (value.trim() === '') {
      return;
    }
    if (onSelect) {
      onSelect(value);
    }
    this.setState({
      isSelectExpanded: !this.state.isSelectExpanded,
    });
  };

  private handleOnToggle = isOpen => {
    this.setState({
      isSelectExpanded: isOpen,
    });
  };

  private handleOnTypeaheadInputChanged = value => {
    const { onSearchChanged } = this.props;
    onSearchChanged(value);
  };

  public render() {
    const { isDisabled, resourceType } = this.props;
    const { isSelectExpanded } = this.state;

    const intl = createIntlEnv();
    const selectOptions = this.getSelectOptions();

    return (
      <Select
        isCreatable
        isDisabled={isDisabled}
        isInputValuePersisted={false}
        isOpen={isSelectExpanded}
        onCreateOption={this.handleOnCreateOption}
        onClear={this.handleOnClear}
        onFilter={this.handleOnFilter}
        onSelect={this.handleOnSelect}
        onToggle={this.handleOnToggle}
        onTypeaheadInputChanged={this.handleOnTypeaheadInputChanged}
        placeholderText={intl.formatMessage(messages.FilterByPlaceholder, { value: resourceType })}
        typeAheadAriaLabel={intl.formatMessage(messages.FilterByInputAriaLabel, { value: resourceType })}
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

const ResourceSelect = connect(mapStateToProps, mapDispatchToProps)(ResourceSelectBase);

export { ResourceSelect };

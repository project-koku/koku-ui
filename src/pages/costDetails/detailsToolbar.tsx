import React from 'react';

import { Button, ButtonVariant } from '@patternfly/react-core';
import { Query } from 'api/query';
import { TextInput } from 'components/textInput';
import { Filter, Icon, noop, Sort, Toolbar } from 'patternfly-react';

interface DetailsToolbarOwnProps {
  filterFields: any;
  sortFields: any;
  exportText: string;
  onFiltersAdded(filterType: string, filterValue: string);
  onFiltersRemoved(filterType: string, filterValue: string);
  onSortChanged?(value: string, evt: React.ChangeEvent<HTMLSelectElement>);
  onActionPerformed?(evt: React.ChangeEvent<HTMLButtonElement>);
  resultsTotal: number;
  query?: Query;
}

type DetailsToolbarProps = DetailsToolbarOwnProps;

export class DetailsToolbar extends React.Component<DetailsToolbarProps> {
  public static defaultProps = { onSortChanged: noop, onActionPerformed: noop };

  public state = {
    activeFilters: [],
    currentFilterType: this.props.filterFields[0],
    currentValue: '',
    currentSortType: this.props.sortFields[0],
    isSortNumeric: this.props.sortFields[0].isNumeric,
    isSortAscending: true,
    currentViewType: 'list',
    filterCategory: undefined,
  };

  public componentDidMount() {
    const { query } = this.props;
    Object.keys(query.group_by).forEach(key => {
      this.addQuery(query);
    });
  }

  public componentDidUpdate(prevProps: DetailsToolbarProps) {
    const { query } = this.props;
    if (!this.isEqual(query, prevProps.query)) {
      this.addQuery(query);
    }
  }

  public addQuery(query: Query) {
    const activeFilters = [];
    Object.keys(query.group_by).forEach(key => {
      if (query.group_by[key] !== '*') {
        if (Array.isArray(query.group_by[key])) {
          query.group_by[key].forEach(value => {
            const filterLabel = this.getFilterLabel(key, value);
            activeFilters.push({ label: filterLabel, value });
          });
        } else {
          const filterLabel = this.getFilterLabel(key, query.group_by[key]);
          activeFilters.push({
            label: filterLabel,
            value: query.group_by[key],
          });
        }
      }
    });
    this.setState({ activeFilters });
  }

  public clearFilters = (event: React.FormEvent<HTMLAnchorElement>) => {
    const { currentFilterType } = this.state;
    this.setState({ activeFilters: [] });
    this.props.onFiltersRemoved(currentFilterType.id, '');
    event.preventDefault();
  };

  public filterAdded = (field, value) => {
    const { currentFilterType } = this.state;
    const filterLabel = this.getFilterLabel(field, value);
    const activeFilters = [
      ...this.state.activeFilters,
      { label: filterLabel, value },
    ];
    this.setState({ activeFilters });
    this.props.onFiltersAdded(currentFilterType.id, value);
  };

  public getFilterLabel = (field, value) => {
    let filterText = '';
    if (field.title) {
      filterText = field.title;
    } else {
      filterText = field;
    }
    filterText += ': ';

    if (value.filterCategory) {
      filterText += `${value.filterCategory.title ||
        value.filterCategory}-${value.filterValue.title || value.filterValue}`;
    } else if (value.title) {
      filterText += value.title;
    } else {
      filterText += value;
    }
    return filterText;
  };

  public isEqual(obj1, obj2) {
    let a = JSON.stringify(obj1);
    let b = JSON.stringify(obj2);
    if (!a) {
      a = '';
    }
    if (!b) {
      b = '';
    }
    return (
      a
        .split('')
        .sort()
        .join('') ===
      b
        .split('')
        .sort()
        .join('')
    );
  }

  public onValueKeyPress = (e: React.KeyboardEvent) => {
    const { currentValue, currentFilterType } = this.state;
    if (e.key === 'Enter' && currentValue && currentValue.length > 0) {
      this.setState({ currentValue: '' });
      this.filterAdded(currentFilterType, currentValue);
      e.stopPropagation();
      e.preventDefault();
    }
  };

  public removeFilter = filter => {
    const { activeFilters, currentFilterType } = this.state;

    const index = activeFilters.indexOf(filter);
    if (index > -1) {
      const updated = [
        ...activeFilters.slice(0, index),
        ...activeFilters.slice(index + 1),
      ];
      this.setState({ activeFilters: updated });
      this.props.onFiltersRemoved(currentFilterType.id, filter.value);
    }
  };

  public selectFilterType = filterType => {
    const { currentFilterType } = this.state;
    if (currentFilterType !== filterType) {
      this.setState({
        currentValue: '',
        currentFilterType: filterType,
      });
    }
  };

  public toggleCurrentSortDirection = () => {
    const { isSortAscending } = this.state;

    this.setState({ isSortAscending: !isSortAscending });
  };

  public updateCurrentSortType = sortType => {
    const { currentSortType } = this.state;

    if (currentSortType !== sortType) {
      this.setState({
        currentSortType: sortType,
        isSortNumeric: sortType.isNumeric,
        isSortAscending: true,
      });
    }
  };

  public updateCurrentValue = (currentValue: string) => {
    this.setState({ currentValue });
  };

  public renderInput() {
    const { currentFilterType, currentValue } = this.state;
    if (!currentFilterType) {
      return null;
    }
    return (
      <TextInput
        onChange={this.updateCurrentValue}
        onKeyPress={this.onValueKeyPress}
        placeholder={currentFilterType.placeholder}
        type="text"
        value={currentValue}
      />
    );
  }

  public render() {
    const {
      activeFilters,
      currentFilterType,
      currentSortType,
      isSortNumeric,
      isSortAscending,
    } = this.state;

    return (
      <Toolbar>
        <Filter>
          <Filter.TypeSelector
            filterTypes={this.props.filterFields}
            currentFilterType={currentFilterType}
            onFilterTypeSelected={this.selectFilterType}
          />
          {this.renderInput()}
        </Filter>
        <Sort>
          <Sort.TypeSelector
            sortTypes={this.props.sortFields}
            currentSortType={currentSortType}
            onSortTypeSelected={this.updateCurrentSortType}
          />
          <Sort.DirectionSelector
            isNumeric={isSortNumeric}
            isAscending={isSortAscending}
            onClick={this.toggleCurrentSortDirection}
          />
        </Sort>
        <Icon name="download" size="2x" />
        <div className="form-group">
          <Button variant={ButtonVariant.link}>Export</Button>
        </div>
        {!activeFilters ||
          (activeFilters.length === 0 && (
            <Toolbar.Results>
              <h5>{this.props.resultsTotal} Results</h5>
            </Toolbar.Results>
          ))}
        {activeFilters &&
          activeFilters.length > 0 && (
            <Toolbar.Results>
              <h5>{this.props.resultsTotal} Results</h5>
              <Filter.ActiveLabel>Active Filters:</Filter.ActiveLabel>
              <Filter.List>
                {activeFilters.map((item, index) => (
                  <Filter.Item
                    key={index}
                    onRemove={this.removeFilter}
                    filterData={item}
                  >
                    {item.label}
                  </Filter.Item>
                ))}
              </Filter.List>
              <a href="#" onClick={this.clearFilters}>
                Clear All Filters
              </a>
            </Toolbar.Results>
          )}
      </Toolbar>
    );
  }
}

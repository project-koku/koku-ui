import PropTypes from 'prop-types';
import React from 'react';

import {
  Button,
  Filter,
  FormControl,
  Icon,
  noop,
  Sort,
  Toolbar,
} from 'patternfly-react';

interface DetailsToolbarOwnProps {
  filterFields: any;
  sortFields: any;
  exportText: string;
  onFiltersChanged?: PropTypes.func;
  onSortChanged?: PropTypes.func;
  onViewChanged?: PropTypes.func;
  onActionPerformed?: PropTypes.func;
  onFindAction?: PropTypes.func;
}

type DetailsToolbarProps = DetailsToolbarOwnProps;

export class DetailsToolbar extends React.Component<DetailsToolbarProps> {
  public static defaultProps = {
    onFiltersChanged: noop,
    onSortChanged: noop,
    onViewChanged: noop,
    onActionPerformed: noop,
    onFindAction: noop,
  };

  public state = {
    currentFilterType: this.props.filterFields[0],
    activeFilters: [],
    currentValue: '',
    currentSortType: this.props.sortFields[0],
    isSortNumeric: this.props.sortFields[0].isNumeric,
    isSortAscending: true,
    currentViewType: 'list',
    filterCategory: undefined,
  };

  public onValueKeyPress = keyEvent => {
    const { currentValue, currentFilterType } = this.state;

    if (keyEvent.key === 'Enter' && currentValue && currentValue.length > 0) {
      this.setState({ currentValue: '' });
      this.filterAdded(currentFilterType, currentValue);
      keyEvent.stopPropagation();
      keyEvent.preventDefault();
    }
  };

  public filterAdded = (field, value) => {
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

    const activeFilters = [...this.state.activeFilters, { label: filterText }];
    this.setState({ activeFilters });
  };

  public filterCategorySelected = category => {
    const { filterCategory } = this.state;
    if (filterCategory !== category) {
      this.setState({ filterCategory: category });
    }
  };

  public filterValueSelected = filterValue => {
    const { currentFilterType, currentValue } = this.state;

    if (filterValue !== currentValue) {
      this.setState({ currentValue: filterValue });
      if (filterValue) {
        this.filterAdded(currentFilterType, filterValue);
      }
    }
  };

  public removeFilter = filter => {
    const { activeFilters } = this.state;

    const index = activeFilters.indexOf(filter);
    if (index > -1) {
      const updated = [
        ...activeFilters.slice(0, index),
        ...activeFilters.slice(index + 1),
      ];
      this.setState({ activeFilters: updated });
    }
  };

  public selectFilterType = filterType => {
    const { currentFilterType } = this.state;
    if (currentFilterType !== filterType) {
      this.setState({
        currentValue: '',
        currentFilterType: filterType,
      });

      if (filterType.filterType === 'complex-select') {
        this.setState({ filterCategory: undefined });
      }
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

  public updateCurrentValue = event => {
    this.setState({ currentValue: event.target.value });
  };

  public renderInput() {
    const { currentFilterType, currentValue } = this.state;
    if (!currentFilterType) {
      return null;
    }
    return (
      <FormControl
        type={currentFilterType.filterType}
        value={currentValue}
        placeholder={currentFilterType.placeholder}
        onChange={this.updateCurrentValue}
        onKeyPress={this.onValueKeyPress}
      />
    );
  }

  public render() {
    const {
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
        <Icon name="download" size="lg" />
        <div className="form-group">
          <Button
            bsStyle="link"
            // onClick={() => {
            //   this.props.onActionPerformed &&
            //     this.props.onActionPerformed('Action: Export');
            // }}
          >
            Export
          </Button>
        </div>
      </Toolbar>
    );
  }
}

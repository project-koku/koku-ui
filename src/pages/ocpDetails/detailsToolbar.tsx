import React from 'react';

import {
  Button,
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownToggle,
} from '@patternfly/react-core';
import { FileExportIcon } from '@patternfly/react-icons';
import { OcpQuery } from 'api/ocpQuery';
import { OcpReport } from 'api/ocpReports';
import { TextInput } from 'components/textInput';
import { Filter, noop, Sort, Toolbar } from 'patternfly-react';
import { isEqual } from 'utils/equal';

import { btnOverride, toggleOverride } from './detailsToolbar.styles';

interface DetailsToolbarOwnProps {
  isExportDisabled: boolean;
  filterFields: any[];
  sortField: any;
  sortFields: any[];
  exportText: string;
  onExportClicked();
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue: string);
  onSortChanged(value: string, isSortAscending: boolean);
  report?: OcpReport;
  resultsTotal: number;
  query?: OcpQuery;
}

type DetailsToolbarProps = DetailsToolbarOwnProps;

export class DetailsToolbar extends React.Component<DetailsToolbarProps> {
  public static defaultProps = { onActionPerformed: noop };

  public state = {
    activeFilters: [],
    currentFilterType: this.props.filterFields[0],
    currentValue: '',
    currentSortType: this.props.sortField,
    isSortNumeric:
      this.props.sortField && this.props.sortField.isNumeric
        ? this.props.sortField.isNumeric
        : false,
    isSortAscending: !(
      this.props.query &&
      this.props.sortField &&
      this.props.sortField.id &&
      this.props.query.order_by[this.props.sortField.id] === 'desc'
    ),
    isSortByOpen: false,
    currentViewType: 'list',
    filterCategory: undefined,
    report: undefined,
  };

  public componentDidUpdate(prevProps: DetailsToolbarProps, prevState) {
    const { filterFields, query, report, sortField } = this.props;
    if (report && !isEqual(report, prevProps.report)) {
      this.addQuery(query);
    }
    if (!isEqual(filterFields, prevProps.filterFields)) {
      this.setState({
        currentFilterType: this.props.filterFields[0],
      });
    }
    if (!isEqual(sortField, prevProps.sortField)) {
      this.setState({
        currentSortType: sortField,
        isSortAscending: !(query && query.order_by[sortField.id] === 'desc'),
      });
    }
  }

  public addQuery = (query: OcpQuery) => {
    const activeFilters = [];
    Object.keys(query.group_by).forEach(key => {
      if (query.group_by[key] !== '*') {
        if (Array.isArray(query.group_by[key])) {
          query.group_by[key].forEach(value => {
            const field = (key as any).id || key;
            const filter = this.getFilter(field, value);
            activeFilters.push(filter);
          });
        } else {
          const field = (key as any).id || key;
          const filter = this.getFilter(field, query.group_by[key]);
          activeFilters.push(filter);
        }
      }
    });
    this.setState({ activeFilters });
  };

  public clearFilters = (event: React.FormEvent<HTMLAnchorElement>) => {
    const { currentFilterType } = this.state;
    this.setState({ activeFilters: [] });
    this.props.onFilterRemoved(currentFilterType.id, '');
    event.preventDefault();
  };

  // Note: Active filters are set upon page refresh -- don't need to do that here
  public filterAdded = (field, value) => {
    const { currentFilterType } = this.state;
    this.props.onFilterAdded(currentFilterType.id, value);
  };

  public getFilter = (field, value) => {
    const { currentFilterType } = this.state;
    const filterLabel = this.getFilterLabel(field, value);
    return {
      field: currentFilterType.id,
      label: filterLabel,
      value,
    };
  };

  public getFilterLabel = (field, value) => {
    let filterText = '';
    if (field.title) {
      filterText = field.title;
    } else {
      filterText = field;
    }
    filterText =
      filterText.charAt(0).toUpperCase() + filterText.slice(1) + ': ';

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

  public handleExportClicked = () => {
    this.props.onExportClicked();
  };

  public handleSortBySelect = event => {
    this.setState({
      isSortByOpen: !this.state.isSortByOpen,
    });
  };

  public handleSortByToggle = isSortByOpen => {
    this.setState({
      isSortByOpen,
    });
  };

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
    const { activeFilters } = this.state;

    const index = activeFilters.indexOf(filter);
    if (index > -1) {
      const updated = [
        ...activeFilters.slice(0, index),
        ...activeFilters.slice(index + 1),
      ];
      this.setState({ activeFilters: updated });
      this.props.onFilterRemoved(filter.field, filter.value);
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
    const { currentSortType, isSortAscending } = this.state;
    this.setState({ isSortAscending: !isSortAscending });
    this.props.onSortChanged(currentSortType.id, !isSortAscending);
  };

  public updateCurrentSortType = (event, sortType) => {
    const isSortAscending = true;
    this.setState({
      currentSortType: sortType,
      isSortNumeric: sortType.isNumeric,
      isSortAscending,
    });
    this.props.onSortChanged(sortType.id, isSortAscending);
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
    const { isExportDisabled, sortFields } = this.props;
    const {
      activeFilters,
      currentFilterType,
      currentSortType,
      isSortNumeric,
      isSortAscending,
      isSortByOpen,
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
          <Dropdown
            onClick={event => event.preventDefault()}
            onSelect={this.handleSortBySelect}
            toggle={
              <DropdownToggle
                className={toggleOverride}
                onToggle={this.handleSortByToggle}
              >
                {currentSortType.title}
              </DropdownToggle>
            }
            isOpen={isSortByOpen}
            dropdownItems={sortFields.map(option => (
              <DropdownItem
                key={option.id}
                onClick={event => this.updateCurrentSortType(event, option)}
              >
                {option.title}
              </DropdownItem>
            ))}
          />
          <Sort.DirectionSelector
            isNumeric={isSortNumeric}
            isAscending={isSortAscending}
            onClick={this.toggleCurrentSortDirection}
          />
        </Sort>
        <div className="form-group">
          <Button
            className={btnOverride}
            isDisabled={isExportDisabled}
            onClick={this.handleExportClicked}
            variant={ButtonVariant.link}
          >
            <FileExportIcon />
            Export
          </Button>
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

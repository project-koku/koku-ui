import React from 'react';

import { Button, ButtonVariant } from '@patternfly/react-core';
import { Query } from 'api/query';
import { Report } from 'api/reports';
import { TextInput } from 'components/textInput';
// import { Filter, Icon, noop, Sort, Toolbar } from 'patternfly-react';
import { Filter, Icon, noop, Toolbar } from 'patternfly-react';
import { isEqual } from 'utils/equal';

interface DetailsToolbarOwnProps {
  filterFields: any[];
  sortField: any;
  sortFields: any[];
  exportText: string;
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue: string);
  onSortChanged?(value: string, isSortAscending: boolean);
  onActionPerformed?(evt: React.ChangeEvent<HTMLButtonElement>);
  report?: Report;
  resultsTotal: number;
  query?: Query;
}

type DetailsToolbarProps = DetailsToolbarOwnProps;

export class DetailsToolbar extends React.Component<DetailsToolbarProps> {
  public static defaultProps = { onActionPerformed: noop };

  public state = {
    activeFilters: [],
    currentFilterType: this.props.filterFields[0],
    currentValue: '',
    currentSortType: this.props.sortField,
    isSortNumeric: this.props.sortField.isNumeric,
    isSortAscending: !(
      this.props.query &&
      this.props.query.order_by[this.props.sortField.id] === 'desc'
    ),
    currentViewType: 'list',
    filterCategory: undefined,
    report: undefined,
  };

  public componentDidUpdate(prevProps: DetailsToolbarProps) {
    const { query, report } = this.props;
    const cacheReport = this.state.report === null && query.group_by.account;
    if (report && (!isEqual(report, prevProps.report) || cacheReport)) {
      // Cache inital report containing so we can find account aliases after multiple filters
      // are applied -- a filtered report won't contain all accounts.
      if (cacheReport) {
        this.setState(
          {
            report,
          },
          () => {
            this.addQuery(query);
          }
        );
      } else {
        this.addQuery(query);
      }
    }
  }

  public addQuery = (query: Query) => {
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
    const filterValue = this.getAccountId(field.id, value);
    this.props.onFilterAdded(currentFilterType.id, filterValue);
  };

  // Temporary workaround until API supports filtering on account aliases
  public getAccountAlias = (field, value) => {
    const { report } = this.state;
    let filterValue = value;
    if (report && report.data && field === 'account') {
      report.data.forEach(data => {
        data.accounts.forEach(accounts => {
          accounts.values.forEach(values => {
            if (values.account === value && values.account_alias) {
              filterValue = values.account_alias;
              return false;
            }
          });
        });
      });
    }
    return filterValue;
  };

  // Temporary workaround until API supports filtering on account aliases
  public getAccountId = (field, value) => {
    const { report } = this.state;
    let filterValue = value;
    if (report && report.data && field === 'account') {
      report.data.forEach(data => {
        data.accounts.forEach(accounts => {
          accounts.values.forEach(values => {
            if (values.account_alias === value && values.account) {
              filterValue = values.account;
              return false;
            }
          });
        });
      });
    }
    return filterValue;
  };

  public getFilter = (field, value) => {
    const { currentFilterType } = this.state;
    const alias = this.getAccountAlias(field, value);
    const filterLabel = this.getFilterLabel(field, alias);
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

  public updateCurrentSortType = sortType => {
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
    const {
      activeFilters,
      currentFilterType,
      // currentSortType,
      // isSortNumeric,
      // isSortAscending,
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
        {/* <Sort>
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
        </Sort> */}
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

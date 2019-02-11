import { Button, ButtonVariant } from '@patternfly/react-core';
import { FileExportIcon } from '@patternfly/react-icons';
import { AwsQuery } from 'api/awsQuery';
import { AwsReport } from 'api/awsReports';
import { TextInput } from 'components/textInput';
import { Filter, Toolbar } from 'patternfly-react';
import React from 'react';
import { isEqual } from 'utils/equal';
import { btnOverride } from './detailsToolbar.styles';

interface DetailsToolbarOwnProps {
  isExportDisabled: boolean;
  filterFields: any[];
  exportText: string;
  onExportClicked();
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue: string);
  report?: AwsReport;
  resultsTotal: number;
  query?: AwsQuery;
}

type DetailsToolbarProps = DetailsToolbarOwnProps;

export class DetailsToolbar extends React.Component<DetailsToolbarProps> {
  public state = {
    activeFilters: [],
    currentFilterType: this.props.filterFields[0],
    currentValue: '',
    currentViewType: 'list',
    filterCategory: undefined,
    report: undefined,
  };

  public componentDidUpdate(prevProps: DetailsToolbarProps, prevState) {
    const { filterFields, query, report } = this.props;
    if (report && !isEqual(report, prevProps.report)) {
      this.addQuery(query);
    }
    if (!isEqual(filterFields, prevProps.filterFields)) {
      this.setState({
        currentFilterType: this.props.filterFields[0],
      });
    }
  }

  public addQuery = (query: AwsQuery) => {
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
      field: field.indexOf('tag:') === 0 ? field : currentFilterType.id,
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

    const index = filterText.indexOf('tag:');
    if (index === 0) {
      filterText = 'Tag: ' + filterText.slice(4) + ': ';
    } else {
      filterText =
        filterText.charAt(0).toUpperCase() + filterText.slice(1) + ': ';
    }

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
    const { isExportDisabled } = this.props;
    const { activeFilters, currentFilterType } = this.state;

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

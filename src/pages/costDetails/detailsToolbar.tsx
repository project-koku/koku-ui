import React from 'react';

import { Button, ButtonVariant } from '@patternfly/react-core';
import { TextInput } from 'components/textInput';
import { Filter, Icon, noop, Sort, Toolbar } from 'patternfly-react';

interface DetailsToolbarOwnProps {
  filterFields: any;
  sortFields: any;
  exportText: string;
  onFiltersChanged(filterType: string, filterValue: string);
  onSortChanged?(value: string, evt: React.ChangeEvent<HTMLSelectElement>);
  onActionPerformed?(evt: React.ChangeEvent<HTMLButtonElement>);
}

type DetailsToolbarProps = DetailsToolbarOwnProps;

export class DetailsToolbar extends React.Component<DetailsToolbarProps> {
  public static defaultProps = { onSortChanged: noop, onActionPerformed: noop };

  public state = {
    currentFilterType: this.props.filterFields[0],
    currentValue: '',
    currentSortType: this.props.sortFields[0],
    isSortNumeric: this.props.sortFields[0].isNumeric,
    isSortAscending: true,
    currentViewType: 'list',
    filterCategory: undefined,
  };

  public filterValueSelected = filterValue => {
    const { currentValue } = this.state;
    if (filterValue !== currentValue) {
      this.setState({ currentValue: filterValue });
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

  public updateCurrentValue = (
    currentValue: string,
    e: React.FormEvent<HTMLInputElement>
  ) => {
    this.setState({ currentValue });
  };

  public executeFilter = (e: React.KeyboardEvent) => {
    const { currentValue, currentFilterType } = this.state;
    this.props.onFiltersChanged(currentFilterType.id, currentValue);
  };

  public renderInput() {
    const { currentFilterType, currentValue } = this.state;
    if (!currentFilterType) {
      return null;
    }
    return (
      <TextInput
        value={currentValue}
        onChange={this.updateCurrentValue}
        onKeyPress={this.executeFilter}
        type="text"
        placeholder={currentFilterType.placeholder}
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
        <Icon name="download" size="2x" />
        <div className="form-group">
          <Button variant={ButtonVariant.link}>Export</Button>
        </div>
      </Toolbar>
    );
  }
}

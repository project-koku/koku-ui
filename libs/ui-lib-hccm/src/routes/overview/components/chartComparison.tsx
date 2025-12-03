import React from 'react';

import type { SelectWrapperOption } from '../../components/selectWrapper';
import { SelectWrapper } from '../../components/selectWrapper';

interface ChartComparisonOwnProps {
  currentItem?: string;
  isDisabled?: boolean;
  onItemClicked(value: string);
  options?: {
    default?: boolean;
    label: string;
    value: string;
  }[];
}

interface ChartComparisonState {
  currentItem?: string;
}

type ChartComparisonProps = ChartComparisonOwnProps;

class ChartComparisonBase extends React.Component<ChartComparisonProps, ChartComparisonState> {
  protected defaultState: ChartComparisonState = {
    currentItem: this.props.options ? this.props.options.find(option => option.default).value : undefined,
  };
  public state: ChartComparisonState = { ...this.defaultState };

  private getSelect = () => {
    const { isDisabled } = this.props;
    const { currentItem } = this.state;

    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find(option => option.value === currentItem);

    return (
      <SelectWrapper
        id="comparison-select"
        isDisabled={isDisabled}
        onSelect={this.handleOnSelect}
        options={selectOptions}
        selection={selection}
      />
    );
  };

  private getSelectOptions = (): SelectWrapperOption[] => {
    const { options } = this.props;

    const selectOptions: SelectWrapperOption[] = [];

    options.map(option => {
      selectOptions.push({
        toString: () => option.label,
        value: option.value,
      });
    });

    return selectOptions;
  };

  private handleOnSelect = (_evt, selection: SelectWrapperOption) => {
    const { onItemClicked } = this.props;

    if (onItemClicked) {
      onItemClicked(selection.value);
    }
    this.setState({
      currentItem: selection.value,
    });
  };

  public render() {
    return this.getSelect();
  }
}

const ChartComparison = ChartComparisonBase;

export { ChartComparison };

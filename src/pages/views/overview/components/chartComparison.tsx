import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import React from 'react';

interface ChartComparisonOwnProps {
  currentItem?: string;
  onItemClicked(value: string);
  options?: {
    label: string;
    value: string;
  }[];
}

interface ChartComparisonState {
  isChartComparisonOpen: boolean;
}

type ChartComparisonProps = ChartComparisonOwnProps;

class ChartComparisonBase extends React.Component<ChartComparisonProps> {
  protected defaultState: ChartComparisonState = {
    isChartComparisonOpen: false,
  };
  public state: ChartComparisonState = { ...this.defaultState };

  private getDropDownItems = () => {
    const { options } = this.props;

    return options.map(option => (
      <DropdownItem component="button" key={option.value} onClick={() => this.handleClick(option.value)}>
        {option.label}
      </DropdownItem>
    ));
  };

  private getCurrentLabel = () => {
    const { currentItem, options } = this.props;

    let label = '';
    for (const option of options) {
      if (currentItem === option.value) {
        label = option.label;
        break;
      }
    }
    return label;
  };

  public handleClick = value => {
    const { onItemClicked } = this.props;
    if (onItemClicked) {
      onItemClicked(value);
    }
  };

  private handleSelect = () => {
    this.setState({
      isChartComparisonOpen: !this.state.isChartComparisonOpen,
    });
  };

  private handleToggle = isChartComparisonOpen => {
    this.setState({
      isChartComparisonOpen,
    });
  };

  public render() {
    const { isChartComparisonOpen } = this.state;
    const dropdownItems = this.getDropDownItems();

    return (
      <Dropdown
        onSelect={this.handleSelect}
        toggle={<DropdownToggle onToggle={this.handleToggle}>{this.getCurrentLabel()}</DropdownToggle>}
        isOpen={isChartComparisonOpen}
        dropdownItems={dropdownItems}
      />
    );
  }
}

const ChartComparison = ChartComparisonBase;

export { ChartComparison };

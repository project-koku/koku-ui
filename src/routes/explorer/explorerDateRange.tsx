import type { MessageDescriptor } from '@formatjs/intl/src/types';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { SelectWrapper } from 'routes/components/selectWrapper';

interface ExplorerDateRangeOwnProps {
  dateRangeType?: string;
  isDisabled?: boolean;
  onSelected(value: string);
  options?: {
    label: MessageDescriptor;
    value: string;
  }[];
}

interface ExplorerDateRangeState {
  isSelectOpen: boolean;
}

type ExplorerDateRangeProps = ExplorerDateRangeOwnProps & WrappedComponentProps;

class ExplorerDateRangeBase extends React.Component<ExplorerDateRangeProps, ExplorerDateRangeState> {
  protected defaultState: ExplorerDateRangeState = {
    isSelectOpen: false,
  };
  public state: ExplorerDateRangeState = { ...this.defaultState };

  private getSelect = () => {
    const { dateRangeType, isDisabled } = this.props;
    const { isSelectOpen } = this.state;

    const selectOptions = this.getSelectOptions();
    const selected = selectOptions.find((option: SelectWrapperOption) => option.value === dateRangeType);

    return (
      <SelectWrapper
        id="dateRangeSelect"
        isDisabled={isDisabled}
        onToggle={this.handleOnToggle}
        onSelect={this.handleOnSelect}
        isOpen={isSelectOpen}
        selected={selected}
        selectOptions={selectOptions}
      />
    );
  };

  private getSelectOptions = (): SelectWrapperOption[] => {
    const { intl, options } = this.props;

    const selectOptions: SelectWrapperOption[] = [];

    options.map(option => {
      selectOptions.push({
        toString: () => intl.formatMessage(option.label, { value: option.value }),
        value: option.value,
      });
    });
    return selectOptions;
  };

  private handleOnSelect = (value: string) => {
    const { onSelected } = this.props;

    if (onSelected) {
      onSelected(value);
    }
    this.setState({
      isSelectOpen: false,
    });
  };

  private handleOnToggle = isSelectOpen => {
    this.setState({ isSelectOpen });
  };

  public render() {
    return this.getSelect();
  }
}

const ExplorerDateRange = injectIntl(ExplorerDateRangeBase);

export { ExplorerDateRange };

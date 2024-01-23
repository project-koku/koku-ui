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
  // TBD...
}

type ExplorerDateRangeProps = ExplorerDateRangeOwnProps & WrappedComponentProps;

class ExplorerDateRangeBase extends React.Component<ExplorerDateRangeProps, ExplorerDateRangeState> {
  protected defaultState: ExplorerDateRangeState = {
    // TBD...
  };
  public state: ExplorerDateRangeState = { ...this.defaultState };

  private getSelect = () => {
    const { dateRangeType, isDisabled } = this.props;

    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find(option => option.value === dateRangeType);

    return (
      <SelectWrapper
        id="date-range-select"
        isDisabled={isDisabled}
        onSelect={this.handleOnSelect}
        options={selectOptions}
        selection={selection}
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

  private handleOnSelect = (_evt, selection: SelectWrapperOption) => {
    const { onSelected } = this.props;

    if (onSelected) {
      onSelected(selection.value);
    }
  };

  public render() {
    return this.getSelect();
  }
}

const ExplorerDateRange = injectIntl(ExplorerDateRangeBase);

export { ExplorerDateRange };

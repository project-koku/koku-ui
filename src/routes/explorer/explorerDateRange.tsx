import type { MessageDescriptor } from '@formatjs/intl/src/types';
import { MenuToggle, Select, SelectList, SelectOption } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

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

interface ExplorerDateRangeOption {
  toString(): string; // label
  value?: string;
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
    const selection = selectOptions.find((option: ExplorerDateRangeOption) => option.value === dateRangeType);

    const toggle = toggleRef => (
      <MenuToggle
        isDisabled={isDisabled}
        ref={toggleRef}
        onClick={() => this.handleOnToggle(!isSelectOpen)}
        isExpanded={isSelectOpen}
      >
        {selection?.toString()}
      </MenuToggle>
    );
    return (
      <Select
        onOpenChange={isExpanded => this.handleOnToggle(isExpanded)}
        onSelect={(_evt, value) => this.handleOnSelect(value as string)}
        isOpen={isSelectOpen}
        selected={selection}
        toggle={toggle}
      >
        <SelectList>
          {selectOptions.map(option => (
            <SelectOption key={option.value} value={option.value}>
              {option.toString()}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
    );
  };

  private getSelectOptions = (): ExplorerDateRangeOption[] => {
    const { intl, options } = this.props;

    const selectOptions: ExplorerDateRangeOption[] = [];

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

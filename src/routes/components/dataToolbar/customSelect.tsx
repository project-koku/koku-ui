import type { SelectOptionObject, ToolbarChipGroup } from '@patternfly/react-core';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import type { Filter } from 'routes/utils/filter';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface CustomSelectOwnProps extends RouterComponentProps, WrappedComponentProps {
  filters?: Filter[];
  isDisabled?: boolean;
  onSelect(event, selection);
  options: ToolbarChipGroup[];
}

interface CustomSelectStateProps {
  // TBD...
}

interface CustomSelectDispatchProps {
  // TBD...
}

interface CustomSelectState {
  isExpanded?: boolean;
}

export interface SelectOptionObjectExt extends SelectOptionObject {
  toString(): string; // label
  value?: string;
}

type CustomSelectProps = CustomSelectOwnProps & CustomSelectStateProps & CustomSelectDispatchProps;

class CustomSelectBase extends React.Component<CustomSelectProps, CustomSelectState> {
  protected defaultState: CustomSelectState = {
    isExpanded: false,
  };
  public state: CustomSelectState = { ...this.defaultState };

  private onCustomSelectToggle = isOpen => {
    this.setState({
      isExpanded: isOpen,
    });
  };

  private getSelectOptions = (): SelectOptionObjectExt[] => {
    const { options } = this.props;

    const selectOptions: SelectOptionObjectExt[] = [];

    options.map(option => {
      selectOptions.push({
        toString: () => option.name,
        value: option.key,
      });
    });
    return selectOptions;
  };

  public render() {
    const { filters, intl, isDisabled, onSelect } = this.props;
    const { isExpanded } = this.state;

    const selectOptions = this.getSelectOptions();
    const selections = filters?.map(filter => {
      return selectOptions.find((option: SelectOptionObjectExt) => option.value === filter.value);
    });

    return (
      <Select
        isDisabled={isDisabled}
        variant={SelectVariant.checkbox}
        aria-label={intl.formatMessage(messages.filterByValuesAriaLabel)}
        onToggle={this.onCustomSelectToggle}
        onSelect={onSelect}
        selections={selections}
        isOpen={isExpanded}
        placeholderText={intl.formatMessage(messages.chooseValuePlaceholder)}
      >
        {selectOptions.map(option => (
          <SelectOption key={option.value} value={option} />
        ))}
      </Select>
    );
  }
}

const CustomSelect = injectIntl(withRouter(CustomSelectBase));

export { CustomSelect };

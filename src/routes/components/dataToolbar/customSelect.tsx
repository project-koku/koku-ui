import './dataToolbar.scss';

import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { SelectWrapper } from 'routes/components/selectWrapper';
import type { Filter } from 'routes/utils/filter';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface CustomSelectOwnProps extends RouterComponentProps, WrappedComponentProps {
  className?: string;
  filters?: Filter[];
  isDisabled?: boolean;
  onSelect(event, selection);
  options: ToolbarChipGroupExt[];
}

interface CustomSelectStateProps {
  // TBD...
}

interface CustomSelectDispatchProps {
  // TBD...
}

interface CustomSelectState {
  // TBD...
}

type CustomSelectProps = CustomSelectOwnProps & CustomSelectStateProps & CustomSelectDispatchProps;

class CustomSelectBase extends React.Component<CustomSelectProps, CustomSelectState> {
  protected defaultState: CustomSelectState = {
    // TBD...
  };
  public state: CustomSelectState = { ...this.defaultState };

  private getSelectOptions = (): SelectWrapperOption[] => {
    const { options } = this.props;

    const selectOptions: SelectWrapperOption[] = [];

    options.map(option => {
      selectOptions.push({
        toString: () => option.name,
        value: option.key,
      });
    });
    return selectOptions;
  };

  public render() {
    const { className, filters, intl, isDisabled, onSelect } = this.props;

    const selectOptions = this.getSelectOptions();
    const selections = filters?.map(filter => {
      return selectOptions.find((option: SelectWrapperOption) => option.value === filter.value);
    });

    return (
      <SelectWrapper
        aria-label={intl.formatMessage(messages.filterByValuesAriaLabel)}
        className={className}
        id="customSelect"
        isDisabled={isDisabled}
        isCheckbox
        onSelect={onSelect}
        placeholder={intl.formatMessage(messages.chooseValuePlaceholder)}
        selections={selections}
        selectOptions={selectOptions}
      />
    );
  }
}

const CustomSelect = injectIntl(withRouter(CustomSelectBase));

export { CustomSelect };

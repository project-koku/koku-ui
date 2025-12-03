import './dataToolbar.scss';

import messages from '@koku-ui/i18n/locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import type { RouterComponentProps } from '../../../utils/router';
import { withRouter } from '../../../utils/router';
import type { Filter } from '../../utils/filter';
import type { SelectWrapperOption } from '../selectWrapper';
import { SelectCheckboxWrapper } from '../selectWrapper';
import type { ToolbarChipGroupExt } from './utils/common';

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
      return selectOptions.find(option => option.value === filter.value);
    });

    return (
      <SelectCheckboxWrapper
        aria-label={intl.formatMessage(messages.filterByValuesAriaLabel)}
        className={className}
        id="custom-select"
        isDisabled={isDisabled}
        onSelect={onSelect}
        options={selectOptions}
        placeholder={intl.formatMessage(messages.chooseValuePlaceholder)}
        selections={selections}
      />
    );
  }
}

const CustomSelect = injectIntl(withRouter(CustomSelectBase));

export { CustomSelect };

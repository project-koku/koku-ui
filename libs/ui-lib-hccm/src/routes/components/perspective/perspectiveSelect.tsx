import type { MessageDescriptor } from '@formatjs/intl/src/types';
import messages from '@koku-ui/i18n/locales/messages';
import { Title } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import type { SelectWrapperOption } from '../selectWrapper';
import { SelectWrapper } from '../selectWrapper';
import { styles } from './perspective.styles';

interface PerspectiveSelectOwnProps {
  currentItem: string;
  isDisabled?: boolean;
  onSelect(value: string);
  options?: {
    isDisabled?: boolean;
    label: MessageDescriptor;
    value: string;
  }[];
  title?: MessageDescriptor;
}

interface PerspectiveSelectState {
  // TBD...
}

type PerspectiveSelectProps = PerspectiveSelectOwnProps & WrappedComponentProps;

class PerspectiveSelectBase extends React.Component<PerspectiveSelectProps, PerspectiveSelectState> {
  protected defaultState: PerspectiveSelectState = {
    // TBD...
  };
  public state: PerspectiveSelectState = { ...this.defaultState };

  private getSelectOptions = (): SelectWrapperOption[] => {
    const { intl, options } = this.props;

    const selections: SelectWrapperOption[] = [];

    options.map(option => {
      selections.push({
        isDisabled: option.isDisabled,
        toString: () => intl.formatMessage(option.label, { value: option.value }),
        value: option.value,
      });
    });
    return selections;
  };

  private getSelect = () => {
    const { currentItem, intl, isDisabled, options } = this.props;

    if (options.length === 1) {
      return (
        <div style={styles.perspectiveOptionLabel}>
          {intl.formatMessage(options[0].label, { value: options[0].value })}
        </div>
      );
    }

    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find(option => option.value === currentItem);

    return (
      <SelectWrapper
        id="perspective-elect"
        isDisabled={isDisabled}
        onSelect={this.handleOnSelect}
        options={selectOptions}
        selection={selection}
      />
    );
  };

  private handleOnSelect = (_evt, selection: SelectWrapperOption) => {
    const { onSelect } = this.props;

    if (onSelect) {
      onSelect(selection.value);
    }
  };

  public render() {
    const { intl, title } = this.props;

    return (
      <div style={styles.perspectiveSelector}>
        <Title headingLevel="h3" size="md" style={styles.perspectiveLabel}>
          {intl.formatMessage(title || messages.perspective)}
        </Title>
        {this.getSelect()}
      </div>
    );
  }
}

const PerspectiveSelect = injectIntl(PerspectiveSelectBase);

export { PerspectiveSelect };

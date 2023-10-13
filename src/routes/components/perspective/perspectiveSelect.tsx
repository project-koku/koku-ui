import type { MessageDescriptor } from '@formatjs/intl/src/types';
import { Title } from '@patternfly/react-core';
import type { SelectOptionObject } from '@patternfly/react-core/deprecated';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core/deprecated';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { styles } from './perspective.styles';

interface PerspectiveSelectOwnProps {
  currentItem: string;
  isDisabled?: boolean;
  onSelected(value: string);
  options?: {
    isDisabled?: boolean;
    label: MessageDescriptor;
    value: string;
  }[];
  title?: MessageDescriptor;
}

interface PerspectiveSelectState {
  isSelectOpen: boolean;
}

interface PerspectiveOption extends SelectOptionObject {
  isDisabled?: boolean;
  toString(): string; // label
  value?: string;
}

type PerspectiveSelectProps = PerspectiveSelectOwnProps & WrappedComponentProps;

class PerspectiveSelectBase extends React.Component<PerspectiveSelectProps, PerspectiveSelectState> {
  protected defaultState: PerspectiveSelectState = {
    isSelectOpen: false,
  };
  public state: PerspectiveSelectState = { ...this.defaultState };

  private getSelectOptions = (): PerspectiveOption[] => {
    const { intl, options } = this.props;

    const selections: PerspectiveOption[] = [];

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
    const { isSelectOpen } = this.state;

    if (options.length === 1) {
      return (
        <div style={styles.perspectiveOptionLabel}>
          {intl.formatMessage(options[0].label, { value: options[0].value })}
        </div>
      );
    }

    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find((option: PerspectiveOption) => option.value === currentItem);

    return (
      <Select
        id="perspectiveSelect"
        isDisabled={isDisabled}
        isOpen={isSelectOpen}
        onSelect={(_evt, value) => this.handleSelect(value)}
        onToggle={(_evt, isExpanded) => this.handleToggle(isExpanded)}
        selections={selection}
        variant={SelectVariant.single}
      >
        {selectOptions.map(option => (
          <SelectOption isDisabled={option.isDisabled} key={option.value} value={option} />
        ))}
      </Select>
    );
  };

  private handleSelect = (selection: PerspectiveOption) => {
    const { onSelected } = this.props;

    if (onSelected) {
      onSelected(selection.value);
    }
    this.setState({
      isSelectOpen: false,
    });
  };

  private handleToggle = isSelectOpen => {
    this.setState({ isSelectOpen });
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

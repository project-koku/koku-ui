import { MessageDescriptor } from '@formatjs/intl/src/types';
import { Select, SelectOption, SelectOptionObject, SelectVariant, Title } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import { styles } from './perspective.styles';

interface PerspectiveOwnProps {
  currentItem: string;
  isDisabled?: boolean;
  onSelected(value: string);
  options?: {
    label: MessageDescriptor;
    value: string;
  }[];
}

interface PerspectiveState {
  isSelectOpen: boolean;
}

interface PerspectiveOption extends SelectOptionObject {
  toString(): string; // label
  value?: string;
}

type PerspectiveProps = PerspectiveOwnProps & WrappedComponentProps;

class PerspectiveBase extends React.Component<PerspectiveProps> {
  protected defaultState: PerspectiveState = {
    isSelectOpen: false,
  };
  public state: PerspectiveState = { ...this.defaultState };

  private getSelectOptions = (): PerspectiveOption[] => {
    const { intl, options } = this.props;

    const selections: PerspectiveOption[] = [];

    options.map(option => {
      selections.push({
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
        onSelect={this.handleSelect}
        onToggle={this.handleToggle}
        selections={selection}
        variant={SelectVariant.single}
      >
        {selectOptions.map(option => (
          <SelectOption key={option.value} value={option} />
        ))}
      </Select>
    );
  };

  private handleSelect = (event, selection: PerspectiveOption) => {
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
    const { intl } = this.props;

    return (
      <div style={styles.perspectiveSelector}>
        <Title headingLevel="h3" size="md" style={styles.perspectiveLabel}>
          {intl.formatMessage(messages.perspective)}
        </Title>
        {this.getSelect()}
      </div>
    );
  }
}

const Perspective = injectIntl(PerspectiveBase);

export { Perspective };

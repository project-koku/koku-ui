import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { styles } from './perspective.styles';

interface PerspectiveOwnProps {
  currentItem?: string;
  isDisabled?: boolean;
  onItemClicked(value: string);
  options?: {
    label: string;
    value: string;
  }[];
}

interface PerspectiveState {
  isPerspectiveOpen: boolean;
}

type PerspectiveProps = PerspectiveOwnProps & WithTranslation;

class PerspectiveBase extends React.Component<PerspectiveProps> {
  protected defaultState: PerspectiveState = {
    isPerspectiveOpen: false,
  };
  public state: PerspectiveState = { ...this.defaultState };

  private getDropDownItems = () => {
    const { options, t } = this.props;

    return options.map(option => (
      <DropdownItem component="button" key={option.value} onClick={() => this.handleClick(option.value)}>
        {t(option.label)}
      </DropdownItem>
    ));
  };

  private getCurrentLabel = () => {
    const { currentItem, options, t } = this.props;

    let label = '';
    for (const option of options) {
      if (currentItem === option.value) {
        label = t(option.label);
        break;
      }
    }
    return label;
  };

  private getDropDown = () => {
    const { isDisabled, options, t } = this.props;
    const { isPerspectiveOpen } = this.state;
    const dropdownItems = this.getDropDownItems();

    if (options.length === 1) {
      return <div style={styles.perspectiveOptionLabel}>{t(options[0].label)}</div>;
    }
    return (
      <Dropdown
        onSelect={this.handleSelect}
        toggle={
          <DropdownToggle isDisabled={isDisabled} onToggle={this.handleToggle}>
            {this.getCurrentLabel()}
          </DropdownToggle>
        }
        isOpen={isPerspectiveOpen}
        dropdownItems={dropdownItems}
      />
    );
  };

  private handleClick = value => {
    const { onItemClicked } = this.props;
    if (onItemClicked) {
      onItemClicked(value);
    }
  };

  private handleSelect = () => {
    this.setState({
      isPerspectiveOpen: !this.state.isPerspectiveOpen,
    });
  };

  private handleToggle = isPerspectiveOpen => {
    this.setState({
      isPerspectiveOpen,
    });
  };

  public render() {
    const { t } = this.props;

    return (
      <div style={styles.perspectiveSelector}>
        <label style={styles.perspectiveLabel}>{t('overview.perspective.label')}</label>
        {this.getDropDown()}
      </div>
    );
  }
}

const Perspective = withTranslation()(PerspectiveBase);

export { Perspective };

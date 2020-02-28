import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { styles } from './perspective.styles';

interface PerspectiveOwnProps {
  currentItem?: string;
  onItemClicked(value: string);
  options?: {
    label: string;
    value: string;
  }[];
}

interface PerspectiveState {
  isPerspectiveOpen: boolean;
}

type PerspectiveProps = PerspectiveOwnProps & InjectedTranslateProps;

class PerspectiveBase extends React.Component<PerspectiveProps> {
  protected defaultState: PerspectiveState = {
    isPerspectiveOpen: false,
  };
  public state: PerspectiveState = { ...this.defaultState };

  // constructor(stateProps, dispatchProps) {
  //   super(stateProps, dispatchProps);
  //   this.handleClick = this.handleClick.bind(this);
  //   this.handleSelect = this.handleSelect.bind(this);
  //   this.handleToggle = this.handleToggle.bind(this);
  // }

  private getDropDownItems = () => {
    const { options, t } = this.props;

    return options.map(option => (
      <DropdownItem
        component="button"
        key={option.value}
        onClick={() => this.handleClick(option.value)}
      >
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

  public handleClick = value => {
    const { onItemClicked } = this.props;
    if (onItemClicked) {
      onItemClicked(value);
    }
  };

  private handleSelect = event => {
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
    const { isPerspectiveOpen } = this.state;
    const dropdownItems = this.getDropDownItems();

    return (
      <div className={css(styles.perspectiveSelector)}>
        <label className={css(styles.perspectiveLabel)}>
          {t('overview.perspective.label')}
        </label>
        <Dropdown
          onSelect={this.handleSelect}
          toggle={
            <DropdownToggle onToggle={this.handleToggle}>
              {this.getCurrentLabel()}
            </DropdownToggle>
          }
          isOpen={isPerspectiveOpen}
          dropdownItems={dropdownItems}
        />
      </div>
    );
  }
}

const Perspective = translate()(PerspectiveBase);

export { Perspective };

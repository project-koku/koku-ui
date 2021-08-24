import { Button, ButtonVariant } from '@patternfly/react-core';
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import React from 'react';
import { uiActions } from 'store/ui';
import { getTestProps, testIds } from 'testIds';
import { styles } from './masthead.styles';

interface Props {
  title: string;
  isSidebarOpen: boolean;
  onClick: typeof uiActions.toggleSidebar;
}

class NavToggleButtonBase extends React.Component<Props> {
  public render() {
    const ToggleButtonIcon: React.SFC<any> = this.props.isSidebarOpen
      ? TimesIcon
      : BarsIcon;
    return (
      <Button
        aria-label={this.props.title}
        style={styles.navToggle}
        onClick={this.props.onClick}
        variant={ButtonVariant.plain}
        {...getTestProps(testIds.masthead.sidebarToggle)}
      >
        <ToggleButtonIcon title={this.props.title} size="md" />
      </Button>
    );
  }
}

export { NavToggleButtonBase, Props };

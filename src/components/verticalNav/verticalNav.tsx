import React from 'react';
import { classNames, css } from 'styles/stylesheet';
import { Page } from '../page';
import { classes, styles } from './verticalNav.styles';

interface Props {
  onLogout(): void;
}

const VerticalNav: React.SFC<Props> = () => (
  <Page.Consumer>
    {({ isVerticalNavOpen }) => (
      <nav
        className={classNames(
          classes.nav,
          !isVerticalNavOpen && classes.collapsed,
          css(styles.transition)
        )}
      />
    )}
  </Page.Consumer>
);

export { VerticalNav };

import { Button, ButtonVariant } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { User } from 'api/users';
import { Bars } from 'icons';
import React from 'react';
import { I18n } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { sessionActions } from 'store/session';
import { uiActions } from 'store/ui';
import { usersSelectors } from 'store/users';
import { getTestProps, testIds } from 'testIds';
import { styles } from './masthead.styles';

interface Props {
  user: User;
  logout: typeof sessionActions.logout;
  toggleSidebar: typeof uiActions.toggleSidebar;
}

const MastheadBase: React.SFC<Props> = ({ user, logout, toggleSidebar }) => (
  <I18n>
    {t => (
      <header
        className={css(styles.masthead)}
        {...getTestProps(testIds.masthead.masthead)}
      >
        <div className={css(styles.section)}>
          <Button
            className={css(styles.navToggle)}
            onClick={toggleSidebar}
            variant={ButtonVariant.action}
            {...getTestProps(testIds.masthead.sidebarToggle)}
          >
            <Bars title={t('navigation_toggle')} size="md" />
          </Button>
          {t('app_title')}
        </div>
        {user && (
          <div className={css(styles.section)}>
            <div
              className={css(styles.name)}
              {...getTestProps(testIds.masthead.username)}
            >
              {user.username}
            </div>
            <Button
              variant={ButtonVariant.primary}
              onClick={logout}
              {...getTestProps(testIds.masthead.logout)}
            >
              {t('logout')}
            </Button>
          </div>
        )}
      </header>
    )}
  </I18n>
);

const Masthead = connect(
  createMapStateToProps(state => ({
    user: usersSelectors.selectCurrentUser(state),
  })),
  {
    toggleSidebar: uiActions.toggleSidebar,
    logout: sessionActions.logout,
  }
)(MastheadBase);

export { Masthead, MastheadBase, Props };

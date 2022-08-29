import { Button, ButtonVariant } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { User } from 'api/users';
import React from 'react';
import { I18n } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { sessionActions } from 'store/session';
import { uiActions, uiSelectors } from 'store/ui';
import { usersSelectors } from 'store/users';
import { getTestProps, testIds } from 'testIds';
import { styles } from './masthead.styles';
import { NavToggleButtonBase } from './navToggleButton';

interface Props {
  user: User;
  isSidebarOpen: boolean;
  logout: typeof sessionActions.logout;
  toggleSidebar: typeof uiActions.toggleSidebar;
}

interface State {
  hasScrolled: boolean;
}

class MastheadBase extends React.Component<Props, State> {
  public state: State = {
    hasScrolled: false,
  };

  public componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  private handleScroll = () => {
    const { hasScrolled } = this.state;
    const threshold = 0;
    const scrollPos = window.scrollY;

    if (scrollPos > threshold && !hasScrolled) {
      this.setState({ hasScrolled: true });
    } else if (scrollPos <= threshold && hasScrolled) {
      this.setState({ hasScrolled: false });
    }
  };

  public render() {
    const { user, logout, isSidebarOpen, toggleSidebar } = this.props;
    const { hasScrolled } = this.state;

    return (
      <I18n>
        {t => (
          <header
            className={css(styles.masthead, hasScrolled && styles.scrolled)}
            {...getTestProps(testIds.masthead.masthead)}
          >
            <div style={styles.section}>
              <NavToggleButtonBase
                title={t('navigation_toggle')}
                isSidebarOpen={isSidebarOpen}
                onClick={toggleSidebar}
              />
              {t('app_title')}
            </div>
            {user && (
              <div style={styles.section}>
                <div
                  style={styles.name}
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
  }
}

const Masthead = connect(
  createMapStateToProps(state => ({
    user: usersSelectors.selectCurrentUser(state),
    isSidebarOpen: uiSelectors.selectIsSidebarOpen(state),
  })),
  {
    toggleSidebar: uiActions.toggleSidebar,
    logout: sessionActions.logout,
  }
)(MastheadBase);

export { Masthead, MastheadBase, Props };

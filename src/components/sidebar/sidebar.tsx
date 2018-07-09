import { css } from '@patternfly/react-styles';
import React from 'react';
import { I18n } from 'react-i18next';
import { connect } from 'react-redux';
import { routes } from 'routes';
import { createMapStateToProps } from 'store/common';
import { uiActions, uiSelectors } from 'store/ui';
import { getTestProps, testIds } from 'testIds';
import { Backdrop } from '../backdrop';
import { VerticalNav, VerticalNavItem } from '../verticalNav';
import { styles } from './sidebar.styles';

interface Props {
  isSidebarOpen: boolean;
  toggleSidebar: typeof uiActions.toggleSidebar;
}

const SidebarBase: React.SFC<Props> = ({ isSidebarOpen, toggleSidebar }) => (
  <I18n>
    {t => (
      <>
        {isSidebarOpen && (
          <Backdrop
            onClick={toggleSidebar}
            className={css(styles.mask)}
            {...getTestProps(testIds.sidebar.backdrop)}
          />
        )}
        <aside
          className={css(styles.sidebar, isSidebarOpen && styles.sidebarOpen)}
        >
          <VerticalNav label="primary navigation">
            {routes.map(route => (
              <VerticalNavItem
                key={route.path}
                onClick={isSidebarOpen ? toggleSidebar : null}
                {...route}
              />
            ))}
          </VerticalNav>
        </aside>
      </>
    )}
  </I18n>
);

const Sidebar = connect(
  createMapStateToProps(state => ({
    isSidebarOpen: uiSelectors.selectIsSidebarOpen(state),
  })),
  {
    toggleSidebar: uiActions.toggleSidebar,
  }
)(SidebarBase);

export { Sidebar, SidebarBase, Props };

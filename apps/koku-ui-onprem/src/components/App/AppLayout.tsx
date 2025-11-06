import {
  Masthead,
  MastheadBrand,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavItem as PFNavItem,
  NavList,
  Page,
  PageSidebar,
  PageSidebarBody,
  PageToggleButton,
} from '@patternfly/react-core';
import React from 'react';
import { Link, Outlet, useMatch } from 'react-router-dom';

export const routes = [
  {
    path: '/',
    element: <div>Overview page</div>,
    title: 'Overview',
  },
  {
    path: '/optimizations',
    element: <div>Optimizations page</div>,
    title: 'Optimizations',
  },
];

interface NavItemProps {
  to: string;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, children }) => {
  const isMatch = useMatch(`${to}/*`);
  return (
    <PFNavItem id={to} isActive={!!isMatch}>
      <Link to={to}>{children}</Link>
    </PFNavItem>
  );
};

const AppLayout = () => {
  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton isHamburger aria-label="Global navigation" />
        </MastheadToggle>
        <MastheadBrand>
          <MastheadLogo component="a">Logo</MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
    </Masthead>
  );

  const sidebar = (
    <PageSidebar>
      <PageSidebarBody>
        <Nav>
          <NavList>
            {routes.map(route => (
              <NavItem key={route.path} to={route.path || ''}>
                {route.title}
              </NavItem>
            ))}
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );

  return (
    <Page mainContainerId="primary-app-container" isManagedSidebar masthead={masthead} sidebar={sidebar}>
      <Outlet />
    </Page>
  );
};

export default AppLayout;

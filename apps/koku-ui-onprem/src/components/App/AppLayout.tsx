import {
  Bullseye,
  Masthead,
  MastheadBrand,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavItem as PFNavItem,
  NavList,
  Page,
  PageSection,
  PageSidebar,
  PageSidebarBody,
  PageToggleButton,
  Spinner,
} from '@patternfly/react-core';
import { ScalprumComponent } from '@scalprum/react-core';
import React from 'react';
import { Link, Navigate, Route, Routes, useMatch } from 'react-router-dom';

export const routes = [
  {
    path: '/openshift/cost-management',
    title: 'Overview',
  },
  {
    path: '/openshift/cost-management/optimizations',
    title: 'Optimizations',
  },
  {
    path: '/openshift/cost-management/ocp',
    title: 'OpenShift',
  },
  {
    path: '/openshift/cost-management/aws',
    title: 'Amazon Web Services',
  },
  {
    path: '/openshift/cost-management/gcp',
    title: 'Google Cloud',
  },
  {
    path: '/openshift/cost-management/azure',
    title: 'Microsoft Azure',
  },
  {
    path: '/openshift/cost-management/explorer',
    title: 'Cost Explorer',
  },
  {
    path: '/openshift/cost-management/settings',
    title: 'Settings',
  },
];

interface NavItemProps {
  to: string;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, children }) => {
  const isMatch = useMatch(`${to}/*`);
  const isMatchExact = useMatch(to);
  const isActive = to === '/openshift/cost-management' ? isMatchExact : isMatch;
  return (
    <PFNavItem id={to} isActive={!!isActive}>
      <Link to={to}>{children}</Link>
    </PFNavItem>
  );
};

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton
            isHamburger
            aria-label="Global navigation"
            isSidebarOpen={isSidebarOpen}
            isExpanded={isSidebarOpen}
            onSidebarToggle={() => setIsSidebarOpen(prev => !prev)}
          />
        </MastheadToggle>
        <MastheadBrand>
          <MastheadLogo component="a">Logo</MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
    </Masthead>
  );

  const sidebar = (
    <PageSidebar isSidebarOpen={isSidebarOpen}>
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
    <Page
      mainContainerId="primary-app-container"
      masthead={masthead}
      sidebar={sidebar}
      isContentFilled
      style={{
        width: '100%',
      }}
    >
      <PageSection isFilled padding={{ default: 'noPadding' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/openshift/cost-management" replace />} />
          <Route
            path="/openshift/cost-management/*"
            element={
              <ScalprumComponent
                scope="costManagement"
                module="./RootApp"
                fallback={
                  <Bullseye>
                    <Spinner size="lg" />
                  </Bullseye>
                }
              />
            }
          />
        </Routes>
      </PageSection>
    </Page>
  );
};

export default AppLayout;

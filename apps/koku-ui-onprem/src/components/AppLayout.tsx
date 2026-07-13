import {
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavExpandable,
  NavList,
  Page,
  PageSection,
  PageSidebar,
  PageSidebarBody,
  PageToggleButton,
} from '@patternfly/react-core';
import React from 'react';

import openshiftLogo from '#/assets/openshift-logo.svg';
import { costRoutes, iamRoutes } from '#/data/routes';

import { AppRoutes } from './AppRoutes';
import { AppToolbar } from './AppToolbar';
import { useIam } from './IamContext';
import { NavItem } from './NavItem';

export const AppLayout = () => {
  const { isOnIamSection } = useIam();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleLeaveIam = React.useCallback((to: string) => {
    window.location.assign(to);
  }, []);

  const handleSidebarToggle = React.useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton
            isHamburger
            aria-label="Global navigation"
            isSidebarOpen={isSidebarOpen}
            isExpanded={isSidebarOpen}
            onSidebarToggle={handleSidebarToggle}
          />
        </MastheadToggle>
        <MastheadBrand>
          <MastheadLogo component="a" href="/">
            <img src={openshiftLogo} alt="OpenShift logo" height={40} />
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <AppToolbar />
      </MastheadContent>
    </Masthead>
  );

  const sidebar = (
    <PageSidebar isSidebarOpen={isSidebarOpen}>
      <PageSidebarBody>
        <Nav>
          <NavList>
            {costRoutes.map(route => (
              <NavItem key={route.path} to={route.path} onLeaveIam={handleLeaveIam}>
                {route.title}
              </NavItem>
            ))}
            <NavExpandable title="Identity and Access Management" isExpanded={isOnIamSection} isActive={isOnIamSection}>
              {iamRoutes.map(route => (
                <NavItem key={route.path} to={route.path} onLeaveIam={handleLeaveIam}>
                  {route.title}
                </NavItem>
              ))}
            </NavExpandable>
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
        <AppRoutes />
      </PageSection>
    </Page>
  );
};

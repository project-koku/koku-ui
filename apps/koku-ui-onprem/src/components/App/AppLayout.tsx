import {
  Bullseye,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavExpandable,
  NavItem as PFNavItem,
  NavList,
  Page,
  PageSection,
  PageSidebar,
  PageSidebarBody,
  PageToggleButton,
  Spinner,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import navStyles from '@patternfly/react-styles/css/components/Nav/nav.mjs';
import { ScalprumComponent } from '@scalprum/react-core';
import openshiftLogo from 'assets/openshift-logo.svg';
import {
  IAM_NAV_ITEMS,
  isOnpremIamBasename,
  RBAC_IAM_ROUTE_PREFIX,
  RBAC_ONPREM_REMOTE,
  toIamHostNavPath,
} from 'onpremRemotes';
import React from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import AppToolbar from './AppToolbar';

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
  onLeaveIam: (to: string) => void;
}

const isIamRoute = (pathname: string, iamBasename: boolean) =>
  iamBasename || pathname.startsWith(RBAC_IAM_ROUTE_PREFIX);

const isCostNavTarget = (to: string) => !to.startsWith(RBAC_IAM_ROUTE_PREFIX);

const isIamNavTarget = (to: string) => to.startsWith(RBAC_IAM_ROUTE_PREFIX);

/** Match active state: `useLocation().pathname` is basename-relative on `/iam/*`. */
const isNavActive = (pathname: string, to: string) => {
  if (to === '/openshift/cost-management') {
    return pathname === to;
  }
  if (isIamNavTarget(to)) {
    const rel = to.slice(RBAC_IAM_ROUTE_PREFIX.length) || '/';
    return pathname === rel || pathname.startsWith(`${rel}/`);
  }
  return pathname === to || pathname.startsWith(`${to}/`);
};

const NavItem: React.FC<NavItemProps & { iamBasename: boolean }> = ({ to, children, onLeaveIam, iamBasename }) => {
  const location = useLocation();
  const isActive = isNavActive(location.pathname, to);
  const onIam = isIamRoute(location.pathname, iamBasename);
  const leaveIamForCost = onIam && isCostNavTarget(to);

  if (leaveIamForCost) {
    return (
      <li className={css(navStyles.navItem)}>
        <button
          type="button"
          className={css(navStyles.navLink, isActive && navStyles.modifiers.current)}
          onClick={() => onLeaveIam(to)}
        >
          {children}
        </button>
      </li>
    );
  }

  if (isIamNavTarget(to)) {
    if (iamBasename) {
      const relTo = to.slice(RBAC_IAM_ROUTE_PREFIX.length) || '/';
      return (
        <li className={css(navStyles.navItem)}>
          <Link to={relTo} className={css(navStyles.navLink, isActive && navStyles.modifiers.current)}>
            {children}
          </Link>
        </li>
      );
    }
    // Full-page `/iam/...` when host router has no basename (Cost → IAM entry).
    return (
      <li className={css(navStyles.navItem)}>
        <a href={to} className={css(navStyles.navLink, isActive && navStyles.modifiers.current)}>
          {children}
        </a>
      </li>
    );
  }

  return (
    <PFNavItem id={to} isActive={!!isActive}>
      <Link to={to}>{children}</Link>
    </PFNavItem>
  );
};

const remoteLoadingFallback = (
  <Bullseye>
    <Spinner size="lg" />
  </Bullseye>
);

const AppLayout = () => {
  const location = useLocation();
  const iamBasename = isOnpremIamBasename();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const onIamSection = isIamRoute(location.pathname, iamBasename);
  const remoteKey = onIamSection ? 'iam' : 'cost';

  const handleLeaveIam = React.useCallback((to: string) => {
    window.location.assign(to);
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
            onSidebarToggle={() => setIsSidebarOpen(prev => !prev)}
          />
        </MastheadToggle>
        <MastheadBrand>
          <MastheadLogo component="a" href="/">
            <img src={openshiftLogo} alt="OpenShift" height={40} />
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
            {routes.map(route => (
              <NavItem key={route.path} to={route.path || ''} onLeaveIam={handleLeaveIam} iamBasename={iamBasename}>
                {route.title}
              </NavItem>
            ))}
            <NavExpandable title="Identity and Access Management" isExpanded={onIamSection} isActive={onIamSection}>
              {IAM_NAV_ITEMS.map(({ label, segment }) => (
                <NavItem
                  key={segment}
                  to={toIamHostNavPath(segment)}
                  onLeaveIam={handleLeaveIam}
                  iamBasename={iamBasename}
                >
                  {label}
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
        <Routes>
          {iamBasename ? (
            <Route
              path="/*"
              element={
                <ScalprumComponent
                  key={remoteKey}
                  scope={RBAC_ONPREM_REMOTE.scope}
                  module={RBAC_ONPREM_REMOTE.module}
                  fallback={remoteLoadingFallback}
                />
              }
            />
          ) : (
            <>
              <Route path="/" element={<Navigate to="/openshift/cost-management" replace />} />
              <Route
                path="/openshift/cost-management/*"
                element={
                  <ScalprumComponent
                    key={remoteKey}
                    scope="costManagement"
                    module="./RootApp"
                    fallback={remoteLoadingFallback}
                  />
                }
              />
              <Route
                path={`${RBAC_IAM_ROUTE_PREFIX}/*`}
                element={
                  <ScalprumComponent
                    key={remoteKey}
                    scope={RBAC_ONPREM_REMOTE.scope}
                    module={RBAC_ONPREM_REMOTE.module}
                    fallback={remoteLoadingFallback}
                  />
                }
              />
            </>
          )}
        </Routes>
      </PageSection>
    </Page>
  );
};

export default AppLayout;

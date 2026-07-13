import { NavItem as PFNavItem } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import navStyles from '@patternfly/react-styles/css/components/Nav/nav.mjs';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { COST_BASENAME, isIamPath, stripIamBasename } from '#/data/routes';

import { useIam } from './IamContext';

interface NavItemProps {
  to: string;
  children: React.ReactNode;
  onLeaveIam: (to: string) => void;
}

/**
 * Match active state against the current pathname.
 *
 * When the RBAC MFE is mounted its router uses `/iam` as a basename, so
 * `useLocation().pathname` is relative to that prefix (e.g. `/roles` instead
 * of `/iam/roles`). The IAM branch of this function strips the prefix before
 * comparing so the active highlight stays correct regardless of which router
 * owns the current URL.
 */
const isNavActive = (pathname: string, to: string) => {
  const rel = isIamPath(to) ? stripIamBasename(to) : to;
  return pathname === rel || (to !== COST_BASENAME && pathname.startsWith(`${rel}/`));
};

/**
 * Custom NavItem wrapper required because this app hosts two independent
 * React Router instances:
 *
 *   1. The **host (Cost Management) router** — handles all `/openshift/*` routes.
 *   2. The **RBAC MFE router** — mounted at `/iam`, uses `/iam` as its basename
 *      so its `useLocation` returns paths relative to that prefix.
 *
 * PatternFly's NavItem is used as-is only for plain Cost routes (the default
 * branch below). The two extra cases it cannot cover are:
 *
 *   • **Leave-IAM transition** — when the user is on an `/iam/*` page and
 *     clicks a Cost route, we cannot navigate with React Router's `<Link>`
 *     because the RBAC MFE router owns the current history. Instead we call
 *     `onLeaveIam()`, which unmounts the MFE and then navigates to the target.
 *
 *   • **Cross-MFE IAM links** — when navigating *into* `/iam/*` from a Cost
 *     page there is no shared router, so we use a full-page `<a href>`.
 *     Once the RBAC MFE is mounted (`isOnIamSection === true`) subsequent
 *     IAM-to-IAM navigation can use React Router's `<Link>` with the
 *     basename-relative path.
 */
export const NavItem: React.FC<NavItemProps> = ({ to, children, onLeaveIam }) => {
  const location = useLocation();
  const { isOnIamSection } = useIam();
  const isActive = isNavActive(location.pathname, to);
  const leaveIamForCost = isOnIamSection && !isIamPath(to);

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

  if (isIamPath(to)) {
    const linkClassName = css(navStyles.navLink, isActive && navStyles.modifiers.current);

    return (
      <li className={css(navStyles.navItem)}>
        {isOnIamSection ? (
          <Link to={stripIamBasename(to)} className={linkClassName}>
            {children}
          </Link>
        ) : (
          // `isOnIamSection === false` means the RBAC MFE is not yet mounted,
          // so there is no MFE router to accept a `<Link>` push. A full-page
          // navigation to `/iam/…` lets the browser bootstrap the MFE from
          // scratch, after which `isOnIamSection` becomes true and subsequent
          // clicks use the `<Link>` branch above.
          <a href={to} className={linkClassName}>
            {children}
          </a>
        )}
      </li>
    );
  }

  return (
    <PFNavItem id={to} isActive={isActive}>
      <Link to={to}>{children}</Link>
    </PFNavItem>
  );
};

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
  onLeaveSection: (to: string) => void;
}

/**
 * Match active state against the current pathname.
 *
 * IAM sets the host basename, so `useLocation().pathname` is relative to `/iam`
 * while the nav `to` values stay absolute.
 */
const isNavActive = (pathname: string, to: string) => {
  const rel = isIamPath(to) ? stripIamBasename(to) : to;
  return pathname === rel || (to !== COST_BASENAME && pathname.startsWith(`${rel}/`));
};

/**
 * Cost and IAM do not share one router basename. Leaving IAM is a full page load.
 * Entering IAM from Cost is an `<a href>` so the next document picks up the basename.
 */
export const NavItem: React.FC<NavItemProps> = ({ to, children, onLeaveSection }) => {
  const location = useLocation();
  const { isOnIamSection } = useIam();
  const isActive = isNavActive(location.pathname, to);
  const stayingInIam = isOnIamSection && isIamPath(to);
  const leaveSection = isOnIamSection && !stayingInIam;
  const linkClassName = css(navStyles.navLink, isActive && navStyles.modifiers.current);

  if (leaveSection) {
    return (
      <li className={css(navStyles.navItem)}>
        <button type="button" className={linkClassName} onClick={() => onLeaveSection(to)}>
          {children}
        </button>
      </li>
    );
  }

  if (isIamPath(to)) {
    return (
      <li className={css(navStyles.navItem)}>
        {isOnIamSection ? (
          <Link to={stripIamBasename(to)} className={linkClassName}>
            {children}
          </Link>
        ) : (
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

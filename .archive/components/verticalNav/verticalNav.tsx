import { css } from '@patternfly/react-styles';
import React from 'react';
import { getTestProps, testIds } from 'testIds';
import { styles } from './verticalNav.styles';

interface Props {
  label: string;
  children?: React.ReactNode;
}

export const VerticalNav: React.SFC<Props> = ({ children, label }) => (
  <nav
    style={styles.verticalNav}
    role="navigation"
    aria-label={label}
    {...getTestProps(testIds.sidebar.nav)}
  >
    <ul>{children}</ul>
  </nav>
);

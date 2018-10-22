import { css } from '@patternfly/react-styles';
import React, { ReactNode } from 'react';
import { styles } from './header.styles';

interface ListHeaderProps {
  children: ReactNode;
}

export const ListHeader: React.SFC<ListHeaderProps> = ({ children }) => (
  <header className={css(styles.header)}>{children}</header>
);

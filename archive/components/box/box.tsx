import { css } from '@patternfly/react-styles';
import React from 'react';
import { styles } from './box.styles';

export type Props = React.HTMLProps<HTMLDivElement>;

export const Box: React.SFC<Props> = ({ children, className, ...props }) => (
  <div className={css(className, styles.box)} {...props}>
    {children}
  </div>
);

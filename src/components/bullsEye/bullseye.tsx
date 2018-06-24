import { css } from '@patternfly/react-styles';
import React from 'react';
import { styles } from './bullseye.styles';

export const Bullseye: React.SFC = ({ children }) => (
  <div className={css(styles.bullseye)}>
    <div>{children}</div>
  </div>
);

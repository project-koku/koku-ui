import { css } from '@patternfly/react-styles';
import React from 'react';
import { styles } from './boxHeader.styles';

export const BoxHeader: React.SFC = ({ children }) => (
  <div className={css(styles.boxHeader)}>{children}</div>
);

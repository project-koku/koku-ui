import { css } from '@patternfly/react-styles';
import React from 'react';
import { styles } from './boxFooter.styles';

export const BoxFooter: React.SFC = ({ children }) => (
  <div style={styles.boxFooter}>{children}</div>
);

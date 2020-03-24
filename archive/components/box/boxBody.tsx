import { css } from '@patternfly/react-styles';
import React from 'react';
import { styles } from './boxBody.styles';

export const BoxBody: React.SFC = ({ children }) => (
  <div style={styles.boxBody}>{children}</div>
);

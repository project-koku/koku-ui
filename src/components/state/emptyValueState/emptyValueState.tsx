import { MinusIcon } from '@patternfly/react-icons';
import React from 'react';
import { styles } from './emptyValueState.styles';

export const EmptyValueState: React.SFC = () => {
  return (
    <span style={styles.container}>
      <MinusIcon />
    </span>
  );
};

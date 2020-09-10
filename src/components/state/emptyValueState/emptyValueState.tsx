import { MinusIcon } from '@patternfly/react-icons/dist/js/icons/minus-icon';
import React from 'react';

import { styles } from './emptyValueState.styles';

export const EmptyValueState: React.SFC = () => {
  return (
    <span style={styles.container}>
      <MinusIcon />
    </span>
  );
};

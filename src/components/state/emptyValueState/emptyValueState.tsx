import { MinusIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { styles } from './emptyValueState.styles';

export const EmptyValueState: React.SFC = () => {
  return (
    <span className={css(styles.container)}>
      <MinusIcon />
    </span>
  );
};

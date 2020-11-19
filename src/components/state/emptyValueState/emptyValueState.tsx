import './emptyValueState.scss';

import { MinusIcon } from '@patternfly/react-icons/dist/js/icons/minus-icon';
import React from 'react';

export const EmptyValueState: React.SFC = () => {
  return (
    <span className="emptyValueContainer">
      <MinusIcon />
    </span>
  );
};

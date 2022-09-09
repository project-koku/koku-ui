import './emptyValueState.scss';

import { MinusIcon } from '@patternfly/react-icons/dist/esm/icons/minus-icon';
import React from 'react';

export const EmptyValueState: React.FC = () => {
  return (
    <span className="emptyValueContainer">
      <MinusIcon />
    </span>
  );
};

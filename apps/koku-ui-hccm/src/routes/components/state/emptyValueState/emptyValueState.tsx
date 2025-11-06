import './emptyValueState.scss';

import { MinusIcon } from '@patternfly/react-icons/dist/esm/icons/minus-icon';
import React from 'react';

const EmptyValueState: React.FC = () => {
  return (
    <span className="emptyValueContainer">
      <MinusIcon />
    </span>
  );
};

export default EmptyValueState;

import './emptyValueState.scss';

import { MinusIcon } from '@patternfly/react-icons/dist/esm/icons/minus-icon';
import React from 'react';

interface EmptyValueStateProps {
  style?: React.CSSProperties;
}

const EmptyValueState: React.FC<EmptyValueStateProps> = ({ style }) => {
  return (
    <span className="emptyValueContainer" style={style}>
      <MinusIcon />
    </span>
  );
};

export default EmptyValueState;

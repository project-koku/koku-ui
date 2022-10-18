import { Tooltip } from '@patternfly/react-core';
import { WarningTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/warning-triangle-icon';
import React from 'react';

interface WarningIconProps {
  text: string;
}

export const WarningIcon: React.FC<WarningIconProps> = ({ text }) => {
  return (
    <Tooltip content={text} enableFlip>
      <WarningTriangleIcon color="orange" />
    </Tooltip>
  );
};

import { Tooltip } from '@patternfly/react-core';
import { WarningTriangleIcon } from '@patternfly/react-icons';
import React from 'react';

interface WarningIconProps {
  text: string;
}

export const WarningIcon: React.SFC<WarningIconProps> = ({ text }) => {
  return (
    <Tooltip content={text} enableFlip>
      <WarningTriangleIcon color="orange" />
    </Tooltip>
  );
};

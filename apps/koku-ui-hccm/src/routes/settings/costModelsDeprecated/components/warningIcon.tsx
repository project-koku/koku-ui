import { Icon, Tooltip } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import React from 'react';

interface WarningIconProps {
  text: string;
}

export const WarningIcon: React.FC<WarningIconProps> = ({ text }) => {
  return (
    <Tooltip content={text} enableFlip>
      <Icon status="warning">
        <ExclamationTriangleIcon />
      </Icon>
    </Tooltip>
  );
};

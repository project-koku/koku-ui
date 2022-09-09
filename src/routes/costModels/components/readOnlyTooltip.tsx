import { Tooltip } from '@patternfly/react-core';
import React from 'react';

interface ReadOnlyTooltipBase {
  tooltip?: string;
  children: JSX.Element;
  isDisabled: boolean;
}

export const ReadOnlyTooltip: React.FC<ReadOnlyTooltipBase> = ({
  children,
  tooltip = 'You have read only permissions',
  isDisabled,
}) => {
  return isDisabled ? (
    <Tooltip isContentLeftAligned content={<div>{tooltip}</div>}>
      <div aria-label="Read only">{children}</div>
    </Tooltip>
  ) : (
    children
  );
};

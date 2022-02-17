import { ChartLabel, ChartLabelProps } from '@patternfly/react-charts';
import { Tooltip } from '@patternfly/react-core';
import React from 'react';

interface ChartLabelTooltipProps extends ChartLabelProps {
  tooltipText: string;
}

const ChartLabelTooltip = ({ content, ...props }) => (
  <Tooltip content={content(props.datum)} enableFlip>
    <ChartLabel {...props} />
  </Tooltip>
);

export { ChartLabelTooltip, ChartLabelTooltipProps };

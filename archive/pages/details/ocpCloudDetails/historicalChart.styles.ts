import {
  global_spacer_3xl,
  global_spacer_lg,
  global_spacer_md,
  global_spacer_sm,
} from '@patternfly/react-tokens';
import React from 'react';

export const chartStyles = {
  chartHeight: 90,
  chartContainerHeight: 215,
};

export const styles = {
  chartContainer: {
    marginLeft: global_spacer_lg.value,
  },
  chartSkeleton: {
    height: '125px',
    marginBottom: global_spacer_md.value,
    marginTop: global_spacer_3xl.value,
  },
  costChart: {
    marginTop: global_spacer_sm.value,
  },
  cpuChart: {
    marginTop: global_spacer_md.value,
  },
  legendSkeleton: {
    marginTop: global_spacer_md.value,
  },
  memoryChart: {
    marginTop: global_spacer_md.value,
  },
} as { [className: string]: React.CSSProperties };

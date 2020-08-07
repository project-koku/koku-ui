import {
  global_spacer_3xl,
  global_spacer_lg,
  global_spacer_md,
  global_spacer_sm,
} from '@patternfly/react-tokens';
import React from 'react';

export const chartStyles = {
  chartHeight: 300,
  chartContainerHeight: 300,
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
    marginBottom: global_spacer_sm.value,
    marginTop: global_spacer_sm.value,
  },
  legendSkeleton: {
    marginTop: global_spacer_md.value,
  },
  trendChart: {
    marginBottom: global_spacer_sm.value,
    marginTop: global_spacer_sm.value,
  },
  usageChart: {
    marginTop: global_spacer_sm.value,
  },
} as { [className: string]: React.CSSProperties };

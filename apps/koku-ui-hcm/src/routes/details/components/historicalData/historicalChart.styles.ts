import t_global_spacer_3xl from '@patternfly/react-tokens/dist/js/t_global_spacer_3xl';
import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const chartStyles = {
  chartHeight: 250,
};

export const styles = {
  chartContainer: {
    marginLeft: t_global_spacer_lg.value,
  },
  chartSkeleton: {
    height: '125px',
    marginBottom: t_global_spacer_md.value,
    marginTop: t_global_spacer_3xl.value,
  },
  costChart: {
    marginBottom: t_global_spacer_sm.value,
    marginTop: t_global_spacer_sm.value,
  },
  legendSkeleton: {
    marginTop: t_global_spacer_md.value,
  },
  trendChart: {
    marginBottom: t_global_spacer_sm.value,
    marginTop: t_global_spacer_sm.value,
  },
  usageChart: {
    marginTop: t_global_spacer_sm.value,
  },
} as { [className: string]: React.CSSProperties };

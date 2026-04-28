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
    marginLeft: t_global_spacer_lg.var,
  },
  chartSkeleton: {
    height: '125px',
    marginBottom: t_global_spacer_md.var,
    marginTop: t_global_spacer_3xl.var,
  },
  costChart: {
    marginBottom: t_global_spacer_sm.var,
    marginTop: t_global_spacer_sm.var,
  },
  legendSkeleton: {
    marginTop: t_global_spacer_md.var,
  },
  trendChart: {
    marginBottom: t_global_spacer_sm.var,
    marginTop: t_global_spacer_sm.var,
  },
  usageChart: {
    marginTop: t_global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };

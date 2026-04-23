import t_global_spacer_2xl from '@patternfly/react-tokens/dist/js/t_global_spacer_2xl';
import t_global_spacer_3xl from '@patternfly/react-tokens/dist/js/t_global_spacer_3xl';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const chartStyles = {
  chartHeight: 300,
};

export const styles = {
  chartSkeleton: {
    height: '125px',
    marginBottom: t_global_spacer_md.var,
    marginTop: t_global_spacer_3xl.var,
  },
  costChart: {
    marginBottom: t_global_spacer_sm.var,
    marginLeft: t_global_spacer_2xl.var,
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

import t_global_spacer_2xl from '@patternfly/react-tokens/dist/js/t_global_spacer_2xl';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_xl from '@patternfly/react-tokens/dist/js/t_global_spacer_xl';
import type React from 'react';

export const chartStyles = {
  chartAltHeight: 250,
  chartHeight: 180,
};

export const styles = {
  comparison: {
    marginBottom: t_global_spacer_md.var,
  },
  comparisonContainer: {
    display: 'flex',
  },
  tabs: {
    marginTop: t_global_spacer_2xl.var,
  },
  tabItems: {
    marginTop: t_global_spacer_xl.var,
  },
} as { [className: string]: React.CSSProperties };

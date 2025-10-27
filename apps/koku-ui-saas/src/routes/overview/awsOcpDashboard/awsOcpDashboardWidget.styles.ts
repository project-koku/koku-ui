import t_global_spacer_2xl from '@patternfly/react-tokens/dist/js/t_global_spacer_2xl';
import t_global_spacer_xl from '@patternfly/react-tokens/dist/js/t_global_spacer_xl';
import type React from 'react';

export const chartStyles = {
  chartAltHeight: 180,
  chartHeight: 80,
};

export const styles = {
  tabs: {
    marginTop: t_global_spacer_2xl.value,
  },
  tabItems: {
    marginTop: t_global_spacer_xl.value,
  },
} as { [className: string]: React.CSSProperties };

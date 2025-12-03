import t_global_background_color_100 from '@patternfly/react-tokens/dist/js/t_global_background_color_100';
import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  addSourceStep: {
    paddingTop: t_global_spacer_lg.value,
  },
  headerDescription: {
    width: '97%',
    wordWrap: 'break-word',
  },
  headerCostModel: {
    padding: t_global_spacer_lg.var,
    paddingBottom: 0,
    backgroundColor: t_global_background_color_100.value,
  },
  pagination: {
    paddingTop: t_global_spacer_sm.value,
  },
  title: {
    paddingBottom: t_global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };

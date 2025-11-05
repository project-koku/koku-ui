import t_global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/t_global_background_color_100';
import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  alertContainer: {
    marginBottom: t_global_spacer_lg.value,
  },
  codeBlock: {
    display: 'flex',
  },
  currentActions: {
    height: '36px',
  },
  headerContainer: {
    paddingBottom: 0,
  },
  optimizedState: {
    minHeight: '285px',
  },
  paginationContainer: {
    marginTop: t_global_spacer_sm.var,
  },
  projectLink: {
    padding: 0,
  },
  utilizationContainer: {
    backgroundColor: t_global_BackgroundColor_light_100.value,
    marginTop: t_global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };

import global_danger_color_100 from '@patternfly/react-tokens/dist/js/global_danger_color_100';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_success_color_100 from '@patternfly/react-tokens/dist/js/global_success_color_100';
import type React from 'react';

export const styles = {
  alertContainer: {
    marginBottom: global_spacer_lg.value,
  },
  codeBlock: {
    display: 'flex',
  },
  container: {
    minHeight: '100vh',
  },
  currentActions: {
    height: '36px',
  },
  decrease: {
    color: global_success_color_100.var,
  },
  increase: {
    color: global_danger_color_100.var,
  },
  leftCodeBlock: {
    flexShrink: 1,
    flexDirection: 'column',
    minWidth: '225px',
  },
  rightCodeBlock: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  },
} as { [className: string]: React.CSSProperties };

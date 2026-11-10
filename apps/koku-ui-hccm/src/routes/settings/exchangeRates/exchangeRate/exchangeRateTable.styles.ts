import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  column: {
    verticalAlign: 'middle',
  },
  label: {
    marginLeft: t_global_spacer_sm.var,
  },
  // Constrain the rate cell so PatternFly Truncate's width-based ellipsis can activate.
  rateColumn: {
    maxWidth: '8rem',
    minWidth: 0,
  },
} as { [className: string]: React.CSSProperties };

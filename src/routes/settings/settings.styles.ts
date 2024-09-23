import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import type React from 'react';

export const styles = {
  headerContainer: {
    paddingBottom: 0,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  tabs: {
    paddingTop: t_global_spacer_lg.var,
  },
} as { [className: string]: React.CSSProperties };

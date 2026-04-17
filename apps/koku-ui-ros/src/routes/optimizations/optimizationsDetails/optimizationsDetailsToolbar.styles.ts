import t_global_spacer_2xl from '@patternfly/react-tokens/dist/js/t_global_spacer_2xl';
import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import type React from 'react';

export const styles = {
  divider: {
    marginTop: t_global_spacer_2xl.var,
  },
  toolbarContainer: {
    marginTop: t_global_spacer_lg.var,
  },
} as { [className: string]: React.CSSProperties };

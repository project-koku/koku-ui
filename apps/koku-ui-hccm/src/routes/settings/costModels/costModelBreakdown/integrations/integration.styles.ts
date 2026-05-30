import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  action: {
    marginLeft: t_global_spacer_md.var,
  },
  alertContainer: {
    marginBottom: t_global_spacer_md.var,
  },
  paginationContainer: {
    marginTop: t_global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };

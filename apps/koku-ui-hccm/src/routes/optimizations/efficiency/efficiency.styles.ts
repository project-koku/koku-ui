import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  alert: {
    marginBottom: t_global_spacer_lg.value,
  },
  headerContainer: {
    paddingBottom: 0,
  },
  paginationContainer: {
    marginTop: t_global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };

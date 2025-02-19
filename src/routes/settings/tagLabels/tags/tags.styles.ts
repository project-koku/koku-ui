import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  action: {
    marginLeft: t_global_spacer_md.var,
  },
  paginationContainer: {
    paddingBottom: t_global_spacer_md.value,
    paddingTop: t_global_spacer_sm.value,
  },
  tableContainer: {
    marginTop: t_global_spacer_lg.var,
  },
} as { [className: string]: React.CSSProperties };

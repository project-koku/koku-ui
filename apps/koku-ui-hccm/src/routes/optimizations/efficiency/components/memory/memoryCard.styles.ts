import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  export: {
    marginTop: '-5px',
  },
  paginationContainer: {
    marginTop: t_global_spacer_sm.var,
  },
  tableTitle: {
    display: 'flex',
    marginTop: t_global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };

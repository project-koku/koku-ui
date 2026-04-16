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
    marginTop: t_global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };

import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
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
  rightCodeBlock: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  },
} as { [className: string]: React.CSSProperties };

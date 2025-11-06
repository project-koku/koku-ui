import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import type React from 'react';

export const styles = {
  emptyState: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sourceTypeTitle: {
    marginBottom: t_global_spacer_md.var,
  },
} as { [className: string]: React.CSSProperties };

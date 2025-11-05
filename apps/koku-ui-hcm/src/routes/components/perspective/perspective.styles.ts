import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import type React from 'react';

export const styles = {
  perspectiveSelector: {
    display: 'flex',
    alignItems: 'center',
  },
  perspectiveLabel: {
    marginBottom: 0,
    marginRight: t_global_spacer_md.var,
    whiteSpace: 'nowrap',
  },
  perspectiveOptionLabel: {
    marginBottom: 6,
    marginLeft: 8,
    marginTop: 6,
  },
} as { [className: string]: React.CSSProperties };

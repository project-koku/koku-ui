import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import type React from 'react';

export const styles = {
  selector: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    marginBottom: 0,
    marginRight: t_global_spacer_md.var,
    whiteSpace: 'nowrap',
  },
} as { [className: string]: React.CSSProperties };

import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import type React from 'react';

export const styles = {
  loading: {
    minHeight: '520px',
  },
  pagination: {
    paddingBottom: t_global_spacer_md.var,
    paddingTop: t_global_spacer_md.var,
  },
} as { [className: string]: React.CSSProperties };

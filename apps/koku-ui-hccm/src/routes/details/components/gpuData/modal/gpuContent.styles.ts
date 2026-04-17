import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import type React from 'react';

export const styles = {
  container: {
    overflow: 'auto',
  },
  loading: {
    minHeight: '520px',
  },
  pagination: {
    paddingBottom: t_global_spacer_md.value,
    paddingTop: t_global_spacer_md.value,
  },
} as { [className: string]: React.CSSProperties };

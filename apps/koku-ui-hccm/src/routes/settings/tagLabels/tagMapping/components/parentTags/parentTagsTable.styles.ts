import t_global_background_color_100 from '@patternfly/react-tokens/dist/js/t_global_background_color_100';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import type React from 'react';

export const styles = {
  loading: {
    backgroundColor: t_global_background_color_100.value,
    minHeight: '520px',
  },
  pagination: {
    backgroundColor: t_global_background_color_100.value,
    paddingBottom: t_global_spacer_md.value,
    paddingTop: t_global_spacer_md.value,
  },
} as { [className: string]: React.CSSProperties };

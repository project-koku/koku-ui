import t_global_background_color_100 from '@patternfly/react-tokens/dist/js/t_global_background_color_100';
import t_global_font_size_md from '@patternfly/react-tokens/dist/js/t_global_font_size_md';
import type React from 'react';

export const styles = {
  alert: {
    marginBottom: t_global_font_size_md.value,
  },
  descContainer: {
    marginTop: t_global_font_size_md.value,
  },
  emptyState: {
    margin: t_global_font_size_md.value,
  },
  icon: {
    margin: t_global_font_size_md.value,
  },
  loading: {
    backgroundColor: t_global_background_color_100.value,
    minHeight: '520px',
  },
  reviewDescContainer: {
    marginBottom: t_global_font_size_md.value,
  },
  reviewTable: {
    marginTop: '-10px',
  },
  spacing: {
    marginRight: t_global_font_size_md.value,
  },
} as { [className: string]: React.CSSProperties };

import t_global_font_size_md from '@patternfly/react-tokens/dist/js/t_global_font_size_md';
import type React from 'react';

export const styles = {
  alert: {
    marginBottom: t_global_font_size_md.var,
  },
  descContainer: {
    marginTop: t_global_font_size_md.var,
  },
  emptyState: {
    margin: t_global_font_size_md.var,
  },
  icon: {
    margin: t_global_font_size_md.var,
  },
  loading: {
    minHeight: '520px',
  },
  reviewDescContainer: {
    marginBottom: t_global_font_size_md.var,
  },
  reviewTable: {
    marginTop: '-10px',
  },
  spacing: {
    marginRight: t_global_font_size_md.var,
  },
} as { [className: string]: React.CSSProperties };

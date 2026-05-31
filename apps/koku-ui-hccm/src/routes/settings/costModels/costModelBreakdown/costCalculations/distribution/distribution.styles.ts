import t_global_font_size_md from '@patternfly/react-tokens/dist/js/t_global_font_size_md';
import t_global_font_size_xl from '@patternfly/react-tokens/dist/js/t_global_font_size_xl';
import type React from 'react';

export const styles = {
  card: {
    minHeight: 330,
  },
  cardDescription: {
    fontSize: t_global_font_size_md.var,
  },
  cardBody: {
    fontSize: t_global_font_size_xl.var,
    textAlign: 'center',
  },
} as { [className: string]: React.CSSProperties };

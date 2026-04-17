import t_global_font_size_2xl from '@patternfly/react-tokens/dist/js/t_global_font_size_2xl';
import t_global_font_size_xl from '@patternfly/react-tokens/dist/js/t_global_font_size_xl';
import t_global_font_size_xs from '@patternfly/react-tokens/dist/js/t_global_font_size_xs';
import type React from 'react';

export const styles = {
  card: {
    marginTop: t_global_font_size_xl.var,
  },
  divider: {
    marginTop: t_global_font_size_2xl.var,
  },
  title: {
    marginTop: t_global_font_size_xs.var,
  },
} as { [className: string]: React.CSSProperties };

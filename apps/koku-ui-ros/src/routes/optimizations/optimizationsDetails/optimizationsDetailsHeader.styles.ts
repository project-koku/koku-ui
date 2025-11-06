import t_global_font_size_md from '@patternfly/react-tokens/dist/js/t_global_font_size_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  headerContainer: {
    paddingBottom: 0,
  },
  infoIcon: {
    fontSize: t_global_font_size_md.value,
  },
  title: {
    paddingBottom: t_global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };

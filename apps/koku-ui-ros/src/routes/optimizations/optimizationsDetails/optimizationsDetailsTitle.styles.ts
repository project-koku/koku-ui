import t_global_font_size_md from '@patternfly/react-tokens/dist/js/t_global_font_size_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  infoIcon: {
    fontSize: t_global_font_size_md.var,
  },
  title: {
    paddingBottom: t_global_spacer_sm.var,
  },
  titleDesc: {
    paddingBottom: t_global_spacer_sm.var,
    paddingTop: 0,
  },
} as { [className: string]: React.CSSProperties };

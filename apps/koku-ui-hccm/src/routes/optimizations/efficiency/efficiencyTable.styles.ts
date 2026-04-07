import t_global_font_size_body_sm from '@patternfly/react-tokens/dist/js/t_global_font_size_body_sm';
import t_global_text_color_subtle from '@patternfly/react-tokens/dist/js/t_global_text_color_subtle';
import type React from 'react';

export const styles = {
  column: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  infoDescription: {
    color: t_global_text_color_subtle.value,
    fontSize: t_global_font_size_body_sm.value,
  },
} as { [className: string]: React.CSSProperties };

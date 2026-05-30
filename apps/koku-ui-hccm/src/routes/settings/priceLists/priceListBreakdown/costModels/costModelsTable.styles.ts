import { t_global_font_size_body_sm, t_global_text_color_subtle } from '@patternfly/react-tokens';
import type React from 'react';

export const styles = {
  infoDescription: {
    color: t_global_text_color_subtle.var,
    fontSize: t_global_font_size_body_sm.var,
  },
} as { [className: string]: React.CSSProperties };

import t_global_font_weight_body_bold_legacy from '@patternfly/react-tokens/dist/js/t_global_font_weight_body_bold_legacy';
import type React from 'react';

export const styles = {
  currency: {
    fontWeight: t_global_font_weight_body_bold_legacy.value as any,
    whiteSpace: 'nowrap',
  },
} as { [className: string]: React.CSSProperties };

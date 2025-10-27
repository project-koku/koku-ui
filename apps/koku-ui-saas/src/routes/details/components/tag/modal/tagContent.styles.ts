import t_global_font_weight_body_bold_legacy from '@patternfly/react-tokens/dist/js/t_global_font_weight_body_bold_legacy';
import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import type React from 'react';

export const styles = {
  dataListHeading: {
    fontWeight: t_global_font_weight_body_bold_legacy.value as any,
  },
  dataListSubHeading: {
    marginBottom: t_global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };

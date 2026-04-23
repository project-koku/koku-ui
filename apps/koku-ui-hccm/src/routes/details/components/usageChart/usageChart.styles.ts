import t_global_font_weight_body_bold_legacy from '@patternfly/react-tokens/dist/js/t_global_font_weight_body_bold_legacy';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import type React from 'react';

export const styles = {
  chartContainer: {
    marginTop: t_global_spacer_md.var,
  },
  chartSkeleton: {
    marginBottom: t_global_spacer_md.var,
  },
  capacity: {
    fontWeight: t_global_font_weight_body_bold_legacy.var,
  },
  legendSkeleton: {
    marginTop: t_global_spacer_md.var,
  },
  subtitle: {
    marginBottom: t_global_spacer_md.var,
  },
} as { [className: string]: React.CSSProperties };

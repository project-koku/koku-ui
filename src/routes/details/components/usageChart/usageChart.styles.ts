import t_global_font_weight_body_bold_legacy from '@patternfly/react-tokens/dist/js/t_global_font_weight_body_bold_legacy';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import type React from 'react';

export const styles = {
  chartContainer: {
    marginTop: t_global_spacer_md.value,
  },
  chartSkeleton: {
    marginBottom: t_global_spacer_md.value,
  },
  capacity: {
    fontWeight: t_global_font_weight_body_bold_legacy.value as any,
  },
  legendSkeleton: {
    marginTop: t_global_spacer_md.value,
  },
  subtitle: {
    marginBottom: t_global_spacer_md.value,
  },
} as { [className: string]: React.CSSProperties };

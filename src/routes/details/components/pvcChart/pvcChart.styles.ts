import t_global_font_weight_body_bold_legacy from '@patternfly/react-tokens/dist/js/t_global_font_weight_body_bold_legacy';
import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_xl from '@patternfly/react-tokens/dist/js/t_global_spacer_xl';
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
  description: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: t_global_spacer_md.value,
    marginRight: t_global_spacer_xl.value,
  },
  divider: {
    marginBottom: t_global_spacer_lg.value,
    marginTop: t_global_spacer_lg.value,
  },
  legendSkeleton: {
    marginTop: t_global_spacer_md.value,
  },
} as { [className: string]: React.CSSProperties };

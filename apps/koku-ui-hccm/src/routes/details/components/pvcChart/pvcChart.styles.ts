import t_global_font_weight_body_bold_legacy from '@patternfly/react-tokens/dist/js/t_global_font_weight_body_bold_legacy';
import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_xl from '@patternfly/react-tokens/dist/js/t_global_spacer_xl';
import type React from 'react';

export const styles = {
  chartContainer: {
    marginTop: t_global_spacer_md.var,
  },
  chartSkeleton: {
    marginBottom: t_global_spacer_md.var,
  },
  capacity: {
    fontWeight: t_global_font_weight_body_bold_legacy.var as any,
  },
  description: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: t_global_spacer_md.var,
    marginRight: t_global_spacer_xl.var,
  },
  divider: {
    marginBottom: t_global_spacer_lg.var,
    marginTop: t_global_spacer_lg.var,
  },
  legendSkeleton: {
    marginTop: t_global_spacer_md.var,
  },
} as { [className: string]: React.CSSProperties };

import t_global_font_weight_body_bold_legacy from '@patternfly/react-tokens/dist/js/t_global_font_weight_body_bold_legacy';
import t_global_spacer_3xl from '@patternfly/react-tokens/dist/js/t_global_spacer_3xl';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import type React from 'react';

export const chartStyles = {
  chartHeight: 150,
  chartWidth: 525,
  subTitle: {
    fontWeight: t_global_font_weight_body_bold_legacy.value as any,
  },
};

export const styles = {
  chartSkeleton: {
    height: '125px',
    marginBottom: t_global_spacer_md.value,
    marginTop: t_global_spacer_3xl.value,
  },
} as { [className: string]: React.CSSProperties };

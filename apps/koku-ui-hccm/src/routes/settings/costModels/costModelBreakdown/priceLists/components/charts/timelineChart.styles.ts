import t_global_color_nonstatus_gray_default from '@patternfly/react-tokens/dist/js/t_global_color_nonstatus_gray_default';
import t_global_color_status_success_default from '@patternfly/react-tokens/dist/js/t_global_color_status_success_default';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import type React from 'react';

export const styles = {
  active: {
    color: t_global_color_status_success_default.var,
  },
  card: {
    marginBottom: t_global_spacer_md.var,
  },
  inactive: {
    color: t_global_color_nonstatus_gray_default.var,
  },
} as { [className: string]: React.CSSProperties };

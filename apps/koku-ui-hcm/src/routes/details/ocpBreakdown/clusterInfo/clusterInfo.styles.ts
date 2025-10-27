import t_global_background_color_100 from '@patternfly/react-tokens/dist/js/t_global_background_color_100';
import t_global_color_status_warning_100 from '@patternfly/react-tokens/dist/js/t_global_color_status_warning_100';
import t_global_font_size_body_sm from '@patternfly/react-tokens/dist/js/t_global_font_size_body_sm';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import type React from 'react';

export const styles = {
  clusterInfoButton: {
    fontSize: t_global_font_size_body_sm.value,
  },
  loading: {
    backgroundColor: t_global_background_color_100.value,
  },
  spacingRight: {
    marginRight: t_global_spacer_md.value,
  },
  updateAvailable: {
    color: t_global_color_status_warning_100.value,
    paddingLeft: '5px',
  },
} as { [className: string]: React.CSSProperties };

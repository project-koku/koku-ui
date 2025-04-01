import t_global_background_color_100 from '@patternfly/react-tokens/dist/js/t_global_background_color_100';
import t_global_font_size_body_sm from '@patternfly/react-tokens/dist/js/t_global_font_size_body_sm';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  backButton: {
    paddingBottom: t_global_spacer_sm.var,
    paddingLeft: 0,
    paddingTop: 0,
  },
  dataDetailsButton: {
    fontSize: t_global_font_size_body_sm.var,
  },
  loading: {
    backgroundColor: t_global_background_color_100.var,
  },
  statusLabel: {
    marginRight: t_global_font_size_body_sm.var,
  },
} as { [className: string]: React.CSSProperties };

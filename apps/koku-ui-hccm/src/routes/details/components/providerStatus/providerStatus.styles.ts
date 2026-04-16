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
  loading: {},
  statusLabel: {
    marginRight: t_global_font_size_body_sm.var,
  },
} as { [className: string]: React.CSSProperties };

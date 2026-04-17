import t_global_color_status_danger_200 from '@patternfly/react-tokens/dist/js/t_global_color_status_danger_200';
import t_global_font_size_sm from '@patternfly/react-tokens/dist/js/t_global_font_size_sm';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_xl from '@patternfly/react-tokens/dist/js/t_global_spacer_xl';
import type React from 'react';

export const styles = {
  emptyState: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: t_global_spacer_xl.var,
    width: '100%',
  },
  failed: {
    color: t_global_color_status_danger_200.var,
  },
  failedButton: {
    fontSize: t_global_font_size_sm.var,
  },
  failedHeader: {
    marginLeft: t_global_spacer_md.var,
  },
} as { [className: string]: React.CSSProperties };

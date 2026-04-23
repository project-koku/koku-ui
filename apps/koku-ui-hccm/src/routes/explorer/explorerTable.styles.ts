import t_global_font_size_body_sm from '@patternfly/react-tokens/dist/js/t_global_font_size_body_sm';
import t_global_spacer_3xl from '@patternfly/react-tokens/dist/js/t_global_spacer_3xl';
import t_global_spacer_xs from '@patternfly/react-tokens/dist/js/t_global_spacer_xs';
import t_global_text_color_subtle from '@patternfly/react-tokens/dist/js/t_global_text_color_subtle';
import type React from 'react';

export const styles = {
  defaultLabel: {
    minWidth: '50px',
  },
  emptyState: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: t_global_spacer_3xl.var,
    height: '35vh',
    width: '100%',
  },
  infoArrow: {
    position: 'relative',
  },
  infoArrowDesc: {
    bottom: t_global_spacer_xs.var,
  },
  infoDescription: {
    color: t_global_text_color_subtle.var,
    fontSize: t_global_font_size_body_sm.var,
  },
} as { [className: string]: React.CSSProperties };

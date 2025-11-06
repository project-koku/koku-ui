import t_global_background_color_100 from '@patternfly/react-tokens/dist/js/t_global_background_color_100';
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
    backgroundColor: t_global_background_color_100.value,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: t_global_spacer_3xl.value,
    height: '35vh',
    width: '100%',
  },
  infoArrow: {
    position: 'relative',
  },
  infoArrowDesc: {
    bottom: t_global_spacer_xs.value,
  },
  infoDescription: {
    color: t_global_text_color_subtle.value,
    fontSize: t_global_font_size_body_sm.value,
  },
} as { [className: string]: React.CSSProperties };

import t_global_font_size_body_sm from '@patternfly/react-tokens/dist/js/t_global_font_size_body_sm';
import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import t_global_text_color_subtle from '@patternfly/react-tokens/dist/js/t_global_text_color_subtle';
import type React from 'react';

export const styles = {
  count: {
    marginRight: t_global_spacer_sm.var,
  },
  description: {
    color: t_global_text_color_subtle.var,
    fontSize: t_global_font_size_body_sm.var,
  },
  sourceLink: {
    fontSize: t_global_font_size_body_sm.var,
  },
  spacingRight: {
    marginRight: t_global_spacer_md.var,
  },
  statusIcon: {
    fontSize: t_global_font_size_body_sm.var,
    paddingRight: t_global_spacer_sm.var,
  },
  stepper: {
    margin: t_global_spacer_lg.var,
  },
} as { [className: string]: React.CSSProperties };

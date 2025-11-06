import t_global_font_size_body_sm from '@patternfly/react-tokens/dist/js/t_global_font_size_body_sm';
import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import t_global_text_color_subtle from '@patternfly/react-tokens/dist/js/t_global_text_color_subtle';
import type React from 'react';

export const styles = {
  count: {
    marginRight: t_global_spacer_sm.value,
  },
  description: {
    color: t_global_text_color_subtle.value,
    fontSize: t_global_font_size_body_sm.value,
  },
  sourceLink: {
    fontSize: t_global_font_size_body_sm.value,
  },
  spacingRight: {
    marginRight: t_global_spacer_md.value,
  },
  statusIcon: {
    fontSize: t_global_font_size_body_sm.value,
    paddingRight: t_global_spacer_sm.value,
  },
  stepper: {
    margin: t_global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };

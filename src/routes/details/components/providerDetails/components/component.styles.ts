import t_global_color_disabled_100 from '@patternfly/react-tokens/dist/js/t_global_color_disabled_100';
import t_global_font_size_body_sm from '@patternfly/react-tokens/dist/js/t_global_font_size_body_sm';
import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  description: {
    color: t_global_color_disabled_100.value,
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

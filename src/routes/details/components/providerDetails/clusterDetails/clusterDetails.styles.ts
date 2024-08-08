import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_disabled_color_100 from '@patternfly/react-tokens/dist/js/global_disabled_color_100';
import global_FontSize_xs from '@patternfly/react-tokens/dist/js/global_FontSize_xs';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import type React from 'react';

export const styles = {
  dataDetailsButton: {
    fontSize: global_FontSize_xs.value,
  },
  description: {
    color: global_disabled_color_100.value,
    fontSize: global_FontSize_xs.value,
  },
  loading: {
    backgroundColor: global_BackgroundColor_light_100.value,
  },
  sourceLink: {
    fontSize: global_FontSize_xs.value,
  },
  spacingRight: {
    marginRight: global_spacer_md.value,
  },
  statusIcon: {
    fontSize: global_FontSize_xs.value,
    paddingRight: global_spacer_sm.value,
  },
  stepper: {
    margin: global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };

import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_FontSize_md from '@patternfly/react-tokens/dist/js/global_FontSize_md';
import global_FontSize_xs from '@patternfly/react-tokens/dist/js/global_FontSize_xs';
import global_warning_color_100 from '@patternfly/react-tokens/dist/js/global_warning_color_100';
import type React from 'react';

export const styles = {
  clusterInfo: {
    fontSize: global_FontSize_xs.value,
  },
  container: {
    overflow: 'auto',
  },
  loading: {
    backgroundColor: global_BackgroundColor_light_100.value,
    minHeight: '520px',
  },
  spacingRight: {
    marginRight: global_FontSize_md.value,
  },
  updateAvailable: {
    color: global_warning_color_100.value,
    paddingLeft: '5px',
  },
} as { [className: string]: React.CSSProperties };

import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_FontSize_md from '@patternfly/react-tokens/dist/js/global_FontSize_md';
import global_FontSize_xs from '@patternfly/react-tokens/dist/js/global_FontSize_xs';
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
  spacing: {
    marginRight: global_FontSize_md.value,
  },
} as { [className: string]: React.CSSProperties };

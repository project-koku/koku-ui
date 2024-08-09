import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_FontSize_xs from '@patternfly/react-tokens/dist/js/global_FontSize_xs';
import type React from 'react';

export const styles = {
  dataDetailsButton: {
    fontSize: global_FontSize_xs.value,
  },
  loading: {
    backgroundColor: global_BackgroundColor_light_100.value,
  },
} as { [className: string]: React.CSSProperties };

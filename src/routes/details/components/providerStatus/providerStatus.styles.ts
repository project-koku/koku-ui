import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_FontSize_sm from '@patternfly/react-tokens/dist/js/global_FontSize_sm';
import global_FontSize_xs from '@patternfly/react-tokens/dist/js/global_FontSize_xs';
import type React from 'react';

export const styles = {
  backButton: {
    paddingBottom: global_FontSize_sm.var,
    paddingLeft: 0,
    paddingTop: 0,
  },
  dataDetailsButton: {
    fontSize: global_FontSize_xs.var,
  },
  loading: {
    backgroundColor: global_BackgroundColor_light_100.var,
  },
  statusLabel: {
    marginRight: global_FontSize_xs.var,
  },
} as { [className: string]: React.CSSProperties };

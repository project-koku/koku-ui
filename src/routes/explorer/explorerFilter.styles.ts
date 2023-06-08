import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import type React from 'react';

export const styles = {
  toolbarContainer: {
    backgroundColor: global_BackgroundColor_light_100.value,
    paddingTop: global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };

import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import type React from 'react';

export const styles = {
  container: {
    backgroundColor: global_BackgroundColor_light_100.var,
    padding: global_spacer_lg.var,
  },
} as { [className: string]: React.CSSProperties };

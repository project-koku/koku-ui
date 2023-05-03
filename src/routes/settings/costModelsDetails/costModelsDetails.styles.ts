import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import type React from 'react';

export const styles = {
  descContainer: {
    backgroundColor: global_BackgroundColor_light_100.value,
    padding: global_spacer_md.value,
  },
} as { [className: string]: React.CSSProperties };

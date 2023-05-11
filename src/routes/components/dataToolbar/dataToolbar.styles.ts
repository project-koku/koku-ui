import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import type React from 'react';

export const styles = {
  export: {
    marginRight: global_spacer_md.value,
  },
  toolbarContainer: {
    backgroundColor: global_BackgroundColor_light_100.value,
    paddingBottom: global_spacer_md.value,
    paddingTop: global_spacer_md.value,
  },
} as { [className: string]: React.CSSProperties };

import {
  global_BackgroundColor_light_100,
  global_spacer_md,
  global_spacer_xl,
} from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  export: {
    marginRight: global_spacer_md.value,
  },
  toolbarContainer: {
    backgroundColor: global_BackgroundColor_light_100.value,
    paddingBottom: global_spacer_md.value,
    paddingTop: global_spacer_md.value,
    paddingLeft: global_spacer_xl.value,
    paddingRight: global_spacer_xl.value,
    marginLeft: global_spacer_xl.value,
    marginRight: global_spacer_xl.value,
  },
} as { [className: string]: React.CSSProperties };

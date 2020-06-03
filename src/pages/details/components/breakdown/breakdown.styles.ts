import {
  global_BackgroundColor_200 as global_BackgroundColor_300,
  global_spacer_lg,
} from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  content: {
    backgroundColor: global_BackgroundColor_300.value,
    paddingBottom: global_spacer_lg.value,
    paddingLeft: global_spacer_lg.value,
    paddingRight: global_spacer_lg.value,
    paddingTop: global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };

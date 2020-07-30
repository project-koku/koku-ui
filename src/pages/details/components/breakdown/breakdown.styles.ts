import { global_spacer_lg } from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  content: {
    paddingBottom: global_spacer_lg.value,
    paddingLeft: global_spacer_lg.value,
    paddingRight: global_spacer_lg.value,
    paddingTop: global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };

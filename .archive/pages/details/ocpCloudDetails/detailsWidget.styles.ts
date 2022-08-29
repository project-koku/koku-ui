import { global_spacer_md, global_spacer_xl } from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  skeleton: {
    marginTop: global_spacer_md.value,
  },
  tabs: {
    marginTop: global_spacer_xl.value,
  },
  viewAllContainer: {
    marginLeft: '-18px',
    paddingTop: global_spacer_md.value,
  },
} as { [className: string]: React.CSSProperties };

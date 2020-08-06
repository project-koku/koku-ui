import { global_spacer_md } from '@patternfly/react-tokens/dist/esm/global_spacer_md'
import React from 'react';

export const styles = {
  perspectiveSelector: {
    display: 'flex',
    alignItems: 'center',
  },
  perspectiveLabel: {
    marginBottom: 0,
    marginRight: global_spacer_md.var,
  },
} as { [className: string]: React.CSSProperties };

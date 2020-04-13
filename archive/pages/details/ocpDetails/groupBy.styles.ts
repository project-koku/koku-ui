import { global_spacer_md } from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  groupBySelector: {
    display: 'flex',
    alignItems: 'center',
  },
  groupBySelectorLabel: {
    marginBottom: 0,
    marginRight: global_spacer_md.var,
  },
} as { [className: string]: React.CSSProperties };

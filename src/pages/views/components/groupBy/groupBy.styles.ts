import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import React from 'react';

export const styles = {
  groupBySelector: {
    display: 'flex',
    alignItems: 'center',
  },
  groupBySelectorLabel: {
    marginBottom: 0,
    marginRight: global_spacer_md.var,
    whiteSpace: 'nowrap',
  },
} as { [className: string]: React.CSSProperties };

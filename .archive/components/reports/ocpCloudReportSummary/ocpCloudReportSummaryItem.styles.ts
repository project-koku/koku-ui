import { global_spacer_md } from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  reportSummaryItem: {
    ':not(:last-child)': {
      marginBottom: global_spacer_md.value,
    },
  },
  test: {
    ':not(foo) svg': {
      overflow: 'visible',
    },
  },
} as { [className: string]: React.CSSProperties };

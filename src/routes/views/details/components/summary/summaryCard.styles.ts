import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import type React from 'react';

export const styles = {
  card: {},
  skeleton: {
    marginTop: global_spacer_md.value,
  },
  viewAllContainer: {
    marginLeft: '-15px',
  },
} as { [className: string]: React.CSSProperties };

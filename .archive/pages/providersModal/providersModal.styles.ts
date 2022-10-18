import { global_spacer_md } from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  alert: {
    marginBottom: global_spacer_md.value,
  },
  docs: {
    marginBottom: global_spacer_md.value,
  },
  modal: {
    // Workaround for isLarge not working properly
    width: '700px',
  },
} as { [className: string]: React.CSSProperties };

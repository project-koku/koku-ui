import { global_spacer_md } from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  tabNavigation: {
    display: 'flex',
    alignItems: 'flex-end',
    marginBottom: global_spacer_md.value,
  },
} as { [className: string]: React.CSSProperties };

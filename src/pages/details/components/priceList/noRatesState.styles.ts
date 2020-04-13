import { global_spacer_xl } from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    height: '50vh',
    marginTop: global_spacer_xl.value,
  },
} as { [className: string]: React.CSSProperties };

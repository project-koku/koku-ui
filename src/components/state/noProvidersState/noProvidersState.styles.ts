import { global_spacer_lg } from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '150px',
  },
  viewSources: {
    marginTop: global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };

import {
  global_primary_color_200,
  global_spacer_lg,
  global_spacer_sm,
} from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(0, 123, 186, 0.2)',
    marginTop: global_spacer_sm.value,
    marginBottom: global_spacer_lg.value,
  },
  bar: {
    height: '100%',
    backgroundColor: global_primary_color_200.value,
  },
} as { [className: string]: React.CSSProperties };

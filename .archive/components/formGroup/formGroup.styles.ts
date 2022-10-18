import {
  global_FontWeight_normal,
  global_gutter,
  global_spacer_sm,
} from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  formGroup: {
    marginBottom: global_gutter.value,
  },
  label: {
    display: 'block',
    fontWeight: global_FontWeight_normal.value as any,
    paddingBottom: global_spacer_sm.value,
  },
} as { [className: string]: React.CSSProperties };

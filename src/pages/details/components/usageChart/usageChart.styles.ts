import {
  global_FontWeight_bold,
  global_spacer_md,
} from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  chartSkeleton: {
    marginBottom: global_spacer_md.value,
  },
  capacity: {
    fontWeight: global_FontWeight_bold.value as any,
  },
  legendSkeleton: {
    marginTop: global_spacer_md.value,
  },
} as { [className: string]: React.CSSProperties };

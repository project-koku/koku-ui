import {
  global_spacer_lg,
  global_spacer_md,
  global_spacer_sm,
} from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  chartSkeleton: {
    marginBottom: global_spacer_md.value,
  },
  freeSpace: {
    marginBottom: global_spacer_lg.value,
    marginLeft: global_spacer_sm.value,
  },
  legendSkeleton: {
    marginTop: global_spacer_md.value,
  },
} as { [className: string]: React.CSSProperties };

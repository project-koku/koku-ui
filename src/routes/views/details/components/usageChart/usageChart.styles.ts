import global_FontWeight_bold from '@patternfly/react-tokens/dist/js/global_FontWeight_bold';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
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

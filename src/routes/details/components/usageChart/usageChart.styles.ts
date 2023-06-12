import global_FontWeight_bold from '@patternfly/react-tokens/dist/js/global_FontWeight_bold';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import type React from 'react';

export const styles = {
  chartContainer: {
    marginTop: global_spacer_md.value,
  },
  chartSkeleton: {
    marginBottom: global_spacer_md.value,
  },
  capacity: {
    fontWeight: global_FontWeight_bold.value as any,
  },
  legendSkeleton: {
    marginTop: global_spacer_md.value,
  },
  subtitle: {
    marginBottom: global_spacer_md.value,
  },
} as { [className: string]: React.CSSProperties };

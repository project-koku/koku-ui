import global_FontWeight_bold from '@patternfly/react-tokens/dist/js/global_FontWeight_bold';
import type React from 'react';

export const styles = {
  currency: {
    fontWeight: global_FontWeight_bold.value as any,
  },
} as { [className: string]: React.CSSProperties };

import { t_global_background_color_secondary_default } from '@patternfly/react-tokens';
import type React from 'react';

export const styles = {
  oddRow: {
    backgroundColor: t_global_background_color_secondary_default.var,
  },
  vertAlign: {
    verticalAlign: 'middle',
  },
} as { [className: string]: React.CSSProperties };

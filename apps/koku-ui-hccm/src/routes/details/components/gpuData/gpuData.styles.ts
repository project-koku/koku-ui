import t_global_spacer_xl from '@patternfly/react-tokens/dist/js/t_global_spacer_xl';
import type React from 'react';

export const styles = {
  linkContainer: {
    marginTop: t_global_spacer_xl.value,
  },
  loading: {
    minHeight: '200px',
  },
} as { [className: string]: React.CSSProperties };

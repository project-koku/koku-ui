import t_global_spacer_xl from '@patternfly/react-tokens/dist/js/t_global_spacer_xl';
import type React from 'react';

export const styles = {
  mainContent: {
    marginTop: t_global_spacer_xl.value,
  },
  subTitle: {
    textAlign: 'right',
  },
} as { [className: string]: React.CSSProperties };

import t_global_background_color_100 from '@patternfly/react-tokens/dist/js/t_global_background_color_100';
import t_global_spacer_xl from '@patternfly/react-tokens/dist/js/t_global_spacer_xl';
import type React from 'react';

export const styles = {
  linkContainer: {
    marginTop: t_global_spacer_xl.value,
  },
  loading: {
    backgroundColor: t_global_background_color_100.value,
    minHeight: '520px',
  },
} as { [className: string]: React.CSSProperties };

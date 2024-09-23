import t_global_background_color_100 from '@patternfly/react-tokens/dist/js/t_global_background_color_100';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  toolbarContainer: {
    backgroundColor: t_global_background_color_100.value,
    paddingTop: t_global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };

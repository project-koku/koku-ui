import t_global_font_size_2xl from '@patternfly/react-tokens/dist/js/t_global_font_size_2xl';
import t_global_font_size_lg from '@patternfly/react-tokens/dist/js/t_global_font_size_lg';
import type React from 'react';

export const styles = {
  divider: {
    marginTop: t_global_font_size_2xl.value,
  },
  toolbarContainer: {
    marginTop: t_global_font_size_lg.value,
  },
} as { [className: string]: React.CSSProperties };

import t_global_background_color_100 from '@patternfly/react-tokens/dist/js/t_global_background_color_100';
import t_global_font_size_body_sm from '@patternfly/react-tokens/dist/js/t_global_font_size_body_sm';
import t_global_spacer_xl from '@patternfly/react-tokens/dist/js/t_global_spacer_xl';
import type React from 'react';

export const styles = {
  dataDetailsButton: {
    fontSize: t_global_font_size_body_sm.value,
  },
  loading: {
    backgroundColor: t_global_background_color_100.value,
  },
  detailsTable: {
    marginBottom: t_global_spacer_xl.value,
    marginTop: t_global_spacer_xl.value,
  },
} as { [className: string]: React.CSSProperties };

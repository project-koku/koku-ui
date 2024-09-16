import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_FontSize_xs from '@patternfly/react-tokens/dist/js/global_FontSize_xs';
import global_spacer_xl from '@patternfly/react-tokens/dist/js/global_spacer_xl';
import type React from 'react';

export const styles = {
  dataDetailsButton: {
    fontSize: global_FontSize_xs.value,
  },
  loading: {
    backgroundColor: global_BackgroundColor_light_100.value,
  },
  detailsTable: {
    marginBottom: global_spacer_xl.value,
    marginTop: global_spacer_xl.value,
  },
} as { [className: string]: React.CSSProperties };

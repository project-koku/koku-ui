import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_xs from '@patternfly/react-tokens/dist/js/global_spacer_xs';
import type React from 'react';

export const styles = {
  firstColumn: {
    width: '250px',
  },
  infoArrow: {
    top: global_spacer_xs.value,
    position: 'relative',
  },
  tableContainer: {
    marginTop: global_spacer_lg.value,
  },
  toolbarContainer: {
    backgroundColor: global_BackgroundColor_light_100.value,
    paddingBottom: global_spacer_lg.value,
    paddingTop: global_spacer_lg.value,
  },
  viewAllContainer: {
    marginTop: global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };

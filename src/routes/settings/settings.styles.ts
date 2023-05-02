import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import type React from 'react';

export const styles = {
  header: {
    backgroundColor: global_BackgroundColor_light_100.var,
    paddingLeft: global_spacer_lg.var,
    paddingRight: global_spacer_lg.var,
    paddingTop: global_spacer_lg.var,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  main: {
    padding: global_spacer_lg.value,
  },
  tabs: {
    backgroundColor: global_BackgroundColor_light_100.var,
    paddingTop: global_spacer_lg.var,
  },
} as { [className: string]: React.CSSProperties };

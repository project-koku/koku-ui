import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import type React from 'react';

export const styles = {
  action: {
    marginLeft: global_spacer_md.var,
  },
  childActionColumn: {
    paddingRight: 0,
  },
  childSourceTypeColumn: {
    paddingRight: global_spacer_sm.value,
  },
  childTagKeyColumn: {
    paddingLeft: global_spacer_lg.value,
  },
  emptyStateContainer: {
    paddingTop: global_spacer_md.value,
  },
  pagination: {
    backgroundColor: global_BackgroundColor_light_100.value,
    paddingBottom: global_spacer_md.value,
    paddingTop: global_spacer_md.value,
  },
} as { [className: string]: React.CSSProperties };

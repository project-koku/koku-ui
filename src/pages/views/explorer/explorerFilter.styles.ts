import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import React from 'react';

export const styles = {
  toolbarContainer: {
    backgroundColor: global_BackgroundColor_light_100.value,
    marginLeft: `-${global_spacer_md.value}`,
    paddingTop: global_spacer_sm.value,
  },
} as { [className: string]: React.CSSProperties };

import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_xs from '@patternfly/react-tokens/dist/js/global_spacer_xs';
import type React from 'react';

export const styles = {
  iconSpacer: {
    marginLeft: global_spacer_xs.value,
  },
  viewSources: {
    marginTop: global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };

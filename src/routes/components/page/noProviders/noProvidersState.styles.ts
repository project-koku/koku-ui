import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_xs from '@patternfly/react-tokens/dist/js/t_global_spacer_xs';
import type React from 'react';

export const styles = {
  iconSpacer: {
    marginLeft: t_global_spacer_xs.value,
  },
  viewSources: {
    marginTop: t_global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };

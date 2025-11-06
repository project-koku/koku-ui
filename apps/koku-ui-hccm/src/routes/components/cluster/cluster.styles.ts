import t_global_spacer_3xl from '@patternfly/react-tokens/dist/js/t_global_spacer_3xl';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  clustersContainer: {
    marginRight: t_global_spacer_3xl.value,
    marginTop: t_global_spacer_sm.value,
  },
} as { [className: string]: React.CSSProperties };

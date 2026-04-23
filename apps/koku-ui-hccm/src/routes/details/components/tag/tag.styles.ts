import t_global_spacer_3xl from '@patternfly/react-tokens/dist/js/t_global_spacer_3xl';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  tagLink: {
    marginLeft: t_global_spacer_sm.var,
  },
  tagsContainer: {
    marginRight: t_global_spacer_3xl.var,
    marginTop: t_global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };

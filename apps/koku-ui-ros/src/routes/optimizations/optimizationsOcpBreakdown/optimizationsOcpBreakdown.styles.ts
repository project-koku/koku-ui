import t_global_spacer_2xl from '@patternfly/react-tokens/dist/js/t_global_spacer_2xl';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import t_global_spacer_xl from '@patternfly/react-tokens/dist/js/t_global_spacer_xl';
import type React from 'react';

export const styles = {
  card: {
    marginTop: t_global_spacer_xl.var,
  },
  divider: {
    marginTop: t_global_spacer_2xl.var,
  },
  title: {
    marginTop: t_global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };

import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  costType: {
    marginTop: t_global_spacer_lg.var,
    width: 'fit-content',
  },
  costTypeContainer: {
    marginTop: t_global_spacer_lg.var,
  },
  currency: {
    marginTop: t_global_spacer_lg.var,
    width: 'fit-content',
  },
  resetContainer: {
    display: 'inline-block',
    paddingLeft: t_global_spacer_md.var,
  },
  title: {
    paddingBottom: t_global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };

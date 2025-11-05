import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import t_global_spacer_xs from '@patternfly/react-tokens/dist/js/t_global_spacer_xs';
import type React from 'react';

export const styles = {
  alert: {
    marginBottom: t_global_spacer_md.var,
  },
  form: {
    marginLeft: t_global_spacer_sm.var,
  },
  modal: {
    input: {
      marginRight: t_global_spacer_xs.var,
    },
    ul: {
      marginLeft: t_global_spacer_sm.var,
    },
  },
  title: {
    marginBottom: t_global_spacer_md.var,
  },
} as { [className: string]: React.CSSProperties };

import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import global_spacer_xs from '@patternfly/react-tokens/dist/js/global_spacer_xs';
import React from 'react';

export const styles = {
  alert: {
    marginBottom: global_spacer_md.var,
  },
  form: {
    marginLeft: global_spacer_sm.var,
  },
  modal: {
    input: {
      marginRight: global_spacer_xs.var,
    },
    ul: {
      marginLeft: global_spacer_sm.var,
    },
  },
  title: {
    marginBottom: global_spacer_md.var,
  },
} as { [className: string]: React.CSSProperties };

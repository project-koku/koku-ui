import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  content: {
    paddingBottom: t_global_spacer_lg.var,
    paddingTop: t_global_spacer_lg.var,
  },
  exportsIcon: {
    marginLeft: t_global_spacer_md.var,
    marginRight: t_global_spacer_sm.var,
  },
  exportsLink: {
    display: 'flex',
    alignItems: 'center',
  },
  pagination: {
    paddingBottom: t_global_spacer_md.var,
    paddingTop: t_global_spacer_md.var,
  },
  toolbarContainer: {
    paddingBottom: t_global_spacer_md.var,
    paddingTop: t_global_spacer_md.var,
  },
} as { [className: string]: React.CSSProperties };

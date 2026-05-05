import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  actions: {
    display: 'flex',
  },
  breadcrumb: {
    paddingBottom: t_global_spacer_md.var,
  },
  headerDescription: {
    width: '97%',
    wordWrap: 'break-word',
  },
  currency: {
    paddingBottom: t_global_spacer_md.var,
    paddingTop: t_global_spacer_lg.var,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  label: {
    marginLeft: t_global_spacer_sm.var,
    verticalAlign: 'middle',
  },
  title: {
    paddingBottom: t_global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };

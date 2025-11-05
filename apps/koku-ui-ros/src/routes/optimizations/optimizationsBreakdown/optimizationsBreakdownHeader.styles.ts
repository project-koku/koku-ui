import t_global_font_size_md from '@patternfly/react-tokens/dist/js/t_global_font_size_md';
import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  description: {
    marginTop: t_global_spacer_lg.var,
  },
  infoIcon: {
    fontSize: t_global_font_size_md.value,
  },
  infoTitle: {
    fontWeight: 'bold',
  },
  title: {
    alignItems: 'center',
    display: 'flex',
    marginTop: t_global_spacer_md.var,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: t_global_spacer_lg.var,
  },
  warningIcon: {
    paddingLeft: t_global_spacer_sm.var,
    paddingTop: '2px',
  },
} as { [className: string]: React.CSSProperties };

import t_global_font_size_md from '@patternfly/react-tokens/dist/js/t_global_font_size_md';
import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  costValue: {
    marginTop: t_global_spacer_lg.var,
    marginBottom: 0,
  },
  dateTitle: {
    textAlign: 'end',
  },
  exportContainer: {
    display: 'flex',
  },
  info: {
    verticalAlign: 'middle',
  },
  infoIcon: {
    fontSize: t_global_font_size_md.value,
  },
  infoTitle: {
    fontWeight: 'bold',
  },
  perspectiveContainer: {
    alignItems: 'unset',
  },
  status: {
    marginBottom: t_global_spacer_sm.var,
  },
  title: {
    paddingBottom: t_global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };

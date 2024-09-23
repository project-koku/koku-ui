import t_global_font_size_sm from '@patternfly/react-tokens/dist/js/t_global_font_size_sm';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import t_global_text_color_100 from '@patternfly/react-tokens/dist/js/t_global_text_color_100';
import t_global_text_color_200 from '@patternfly/react-tokens/dist/js/t_global_text_color_200';
import type React from 'react';

export const styles = {
  cost: {
    display: 'flex',
    alignItems: 'center',
  },
  costValue: {
    marginTop: 0,
    marginBottom: 0,
    marginRight: t_global_spacer_md.var,
  },
  costLabelUnit: {
    fontSize: t_global_font_size_sm.value,
    color: t_global_text_color_100.var,
  },
  costLabelDate: {
    fontSize: t_global_font_size_sm.value,
    color: t_global_text_color_200.var,
  },
  headerContent: {
    alignItems: 'unset',
    minHeight: '36px',
  },
  headerContentRight: {
    display: 'flex',
  },
  perspectiveContainer: {
    alignItems: 'unset',
    paddingTop: t_global_spacer_md.var,
  },
  title: {
    paddingBottom: t_global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };

import t_global_font_size_body_sm from '@patternfly/react-tokens/dist/js/t_global_font_size_body_sm';
import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import t_global_spacer_xs from '@patternfly/react-tokens/dist/js/t_global_spacer_xs';
import t_global_text_color_subtle from '@patternfly/react-tokens/dist/js/t_global_text_color_subtle';
import type React from 'react';

export const styles = {
  clusterInfoContainer: {
    marginLeft: '-17px',
  },
  costDistribution: {
    marginTop: t_global_spacer_sm.var,
    paddingBottom: t_global_spacer_sm.var,
  },
  costLabel: {
    marginTop: t_global_spacer_lg.var,
  },
  costValue: {
    marginTop: 0,
    marginBottom: 0,
    textAlign: 'right',
  },
  costLabelDate: {
    textAlign: 'right',
  },
  costType: {
    marginTop: t_global_spacer_sm.var,
    paddingBottom: t_global_spacer_sm.var,
  },
  description: {
    color: t_global_text_color_subtle.value,
    fontSize: t_global_font_size_body_sm.value,
    marginBottom: 0,
  },
  filterChip: {
    marginRight: t_global_spacer_md.var,
  },
  filteredBy: {
    whiteSpace: 'nowrap',
  },
  filteredByContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: t_global_spacer_sm.var,
    marginTop: t_global_spacer_sm.var,
  },
  headerContent: {
    alignItems: 'unset',
    minHeight: '36px',
  },
  perspectiveContainer: {
    alignItems: 'unset',
    paddingBottom: t_global_spacer_sm.var,
    paddingLeft: '1px',
    paddingTop: t_global_spacer_xs.var,
  },
  tabs: {
    display: 'flex',
  },
  tag: {
    marginLeft: t_global_spacer_lg.var,
    marginTop: t_global_spacer_xs.var,
  },
} as { [className: string]: React.CSSProperties };

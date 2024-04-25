import global_BackgroundColor_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_100';
import global_disabled_color_100 from '@patternfly/react-tokens/dist/js/global_disabled_color_100';
import global_FontSize_xs from '@patternfly/react-tokens/dist/js/global_FontSize_xs';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import global_spacer_xs from '@patternfly/react-tokens/dist/js/global_spacer_xs';
import type React from 'react';

export const styles = {
  clusterInfoContainer: {
    marginLeft: '-17px',
  },
  costDistribution: {
    marginTop: global_spacer_sm.var,
    paddingBottom: global_spacer_sm.var,
  },
  costLabel: {
    marginTop: global_spacer_lg.var,
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
    marginTop: global_spacer_sm.var,
    paddingBottom: global_spacer_sm.var,
  },
  description: {
    color: global_disabled_color_100.value,
    fontSize: global_FontSize_xs.value,
    marginBottom: 0,
  },
  filterChip: {
    marginRight: global_spacer_md.var,
  },
  filteredBy: {
    marginRight: global_spacer_sm.var,
    whiteSpace: 'nowrap',
  },
  filteredByContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: global_spacer_sm.var,
    marginTop: global_spacer_sm.var,
  },
  filteredByWarning: {
    marginTop: global_spacer_sm.var,
    marginBottom: global_spacer_md.var,
  },
  header: {
    backgroundColor: global_BackgroundColor_100.var,
    paddingLeft: global_spacer_lg.var,
    paddingRight: global_spacer_lg.var,
    paddingTop: global_spacer_lg.var,
  },
  headerContent: {
    alignItems: 'unset',
    minHeight: '36px',
  },
  perspectiveContainer: {
    alignItems: 'unset',
    paddingBottom: global_spacer_sm.var,
    paddingLeft: '1px',
    paddingTop: global_spacer_xs.var,
  },
  tabs: {
    display: 'flex',
  },
  tag: {
    marginLeft: global_spacer_lg.var,
  },
} as { [className: string]: React.CSSProperties };

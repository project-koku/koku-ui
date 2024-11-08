import { chart_color_blue_300 } from '@patternfly/react-tokens/dist/js/chart_color_blue_300';
import { global_palette_blue_50 } from '@patternfly/react-tokens/dist/js/global_palette_blue_50';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import type React from 'react';

export const styles = {
  card: {
    minHeight: '240px',
  },
  cardBodyItem: {
    marginTop: global_spacer_md.var,
  },
  cardTitle: {
    display: 'flex',
    verticalAlign: 'middle',
  },
  cardTitleIcon: {
    color: chart_color_blue_300.var,
    marginRight: global_spacer_sm.var,
  },
  divider: {
    marginLeft: global_spacer_lg.var,
    marginRight: global_spacer_lg.var,
  },
  getStarted: {
    marginBottom: global_spacer_md.var,
  },
  header: {
    display: 'flex',
  },
  headerDesc: {
    marginTop: global_spacer_md.var,
  },
  headerLink: {
    marginLeft: '-16px',
    marginTop: global_spacer_sm.var,
  },
  recommended: {
    marginTop: global_spacer_md.var,
  },
  recommendedCol1: {
    paddingTop: '15px',
  },
  recommendedCol2: {
    paddingTop: '10px',
  },
  recommendedCol3: {
    textAlign: 'right',
    marginRight: '-20px',
  },
  resources: {
    marginLeft: '-15px',
    marginTop: global_spacer_sm.var,
  },
  troubleshooting: {
    backgroundColor: global_palette_blue_50.var,
    marginTop: global_spacer_lg.var,
  },
  troubleshootingDesc: {
    display: 'flex',
    justifyContent: 'space-between',
  },
} as { [className: string]: React.CSSProperties };

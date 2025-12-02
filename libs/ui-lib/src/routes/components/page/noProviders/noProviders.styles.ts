import { chart_color_blue_300 } from '@patternfly/react-tokens/dist/js/chart_color_blue_300';
import { t_global_color_nonstatus_blue_default } from '@patternfly/react-tokens/dist/js/t_global_color_nonstatus_blue_default';
import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  card: {
    minHeight: '240px',
  },
  cardBodyItem: {
    marginTop: t_global_spacer_md.var,
  },
  cardTitle: {
    display: 'flex',
    verticalAlign: 'middle',
  },
  cardTitleIcon: {
    color: chart_color_blue_300.var,
    marginRight: t_global_spacer_sm.var,
  },
  divider: {
    marginLeft: t_global_spacer_lg.var,
    marginRight: t_global_spacer_lg.var,
  },
  getStarted: {
    marginBottom: t_global_spacer_md.var,
  },
  getStartedContainer: {
    paddingTop: 0,
  },
  header: {
    display: 'flex',
  },
  headerDesc: {
    marginTop: t_global_spacer_md.var,
  },
  headerLink: {
    marginLeft: '-16px',
    marginTop: t_global_spacer_sm.var,
  },
  recommended: {
    marginTop: t_global_spacer_md.var,
  },
  recommendedCol1: {
    paddingTop: '15px',
  },
  recommendedCol2: {
    paddingTop: '14px',
  },
  recommendedCol3: {
    textAlign: 'right',
    marginRight: '-20px',
  },
  resources: {
    marginLeft: '-5px',
    marginTop: t_global_spacer_sm.var,
  },
  troubleshooting: {
    backgroundColor: t_global_color_nonstatus_blue_default.var,
    marginTop: t_global_spacer_lg.var,
  },
  troubleshootingDesc: {
    display: 'flex',
    justifyContent: 'space-between',
  },
} as { [className: string]: React.CSSProperties };
